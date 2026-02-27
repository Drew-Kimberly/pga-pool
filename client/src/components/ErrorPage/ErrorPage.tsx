import { Box, Button, PageContent, Text } from 'grommet';
import { CircleInformation, Home } from 'grommet-icons';
import React from 'react';
import { useNavigate } from 'react-router';

interface ErrorPageProps {
  title?: string;
  message?: string;
  error?: string;
  errorDescription?: string;
  showHomeButton?: boolean;
  icon?: React.ReactNode;
}

export const ErrorPage = ({
  title = 'Oops! Something went wrong',
  message = 'An unexpected error occurred.',
  error,
  errorDescription,
  showHomeButton = true,
  icon,
}: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <PageContent>
      <Box height="medium" round="small" align="center" justify="center">
        {icon || <CircleInformation size="large" />}
        <Text size="large" textAlign="center" margin="small">
          {title}
          {message && (
            <>
              <br />
              {message}
            </>
          )}
        </Text>
        {(error || errorDescription) && (
          <Text size="small" color="text-weak" textAlign="center" margin="small">
            {error && `Error: ${error}`}
            {error && errorDescription && ' - '}
            {errorDescription}
          </Text>
        )}
        {showHomeButton && (
          <Button
            primary
            icon={<Home />}
            label="Go to Home"
            onClick={() => navigate('/')}
            margin={{ top: 'small' }}
          />
        )}
      </Box>
    </PageContent>
  );
};
