import { Avatar } from 'grommet';
import { User } from 'grommet-icons';
import React, { useEffect, useState } from 'react';

interface UserAvatarProps {
  src?: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string;
  name?: string;
}

const MAX_RETRY_ATTEMPTS = 2;
const RETRY_DELAY = 1000; // 1 second
const IMAGE_CACHE_KEY = 'pga-pool-avatar-cache';

interface AvatarCache {
  [url: string]: {
    status: 'success' | 'error';
    timestamp: number;
  };
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, size = 'small', name }) => {
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    const cacheStr = localStorage.getItem(IMAGE_CACHE_KEY);
    if (cacheStr) {
      try {
        const cache: AvatarCache = JSON.parse(cacheStr);
        const cachedEntry = cache[src];
        if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
          if (cachedEntry.status === 'error') {
            setImageError(true);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        // Invalid cache, ignore
      }
    }

    setIsLoading(false);
  }, [src]);

  const handleImageError = () => {
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      // Retry after delay
      setTimeout(
        () => {
          setRetryCount(retryCount + 1);
        },
        RETRY_DELAY * (retryCount + 1)
      );
    } else {
      // Max retries reached, mark as error
      setImageError(true);

      // Update cache
      if (src) {
        try {
          const cacheStr = localStorage.getItem(IMAGE_CACHE_KEY);
          const cache: AvatarCache = cacheStr ? JSON.parse(cacheStr) : {};
          cache[src] = {
            status: 'error',
            timestamp: Date.now(),
          };
          localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
          // Ignore cache errors
        }
      }
    }
  };

  const handleImageLoad = () => {
    // Update cache on successful load
    if (src) {
      try {
        const cacheStr = localStorage.getItem(IMAGE_CACHE_KEY);
        const cache: AvatarCache = cacheStr ? JSON.parse(cacheStr) : {};
        cache[src] = {
          status: 'success',
          timestamp: Date.now(),
        };
        localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
      } catch (e) {
        // Ignore cache errors
      }
    }
  };

  // Generate initials from name as fallback
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  if (!src || imageError || isLoading) {
    // Fallback to icon or initials
    if (name) {
      return (
        <Avatar size={size} background="brand">
          {getInitials(name)}
        </Avatar>
      );
    }
    return <User size={size} />;
  }

  return (
    <Avatar
      key={`${src}-${retryCount}`} // Force re-render on retry
      src={src}
      size={size}
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
};
