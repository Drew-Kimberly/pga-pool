import { Box, Button, Menu, Text } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import React from 'react';

import { useAuth } from '../../hooks';
import { UserAvatar } from '../UserAvatar';

export const LoginButton: React.FC = () => {
  const { isAuthenticated, isLoading, user, login, logout, currentLeague } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    return <Button icon={<Login />} label="Login" onClick={login} plain />;
  }

  const userAvatar = <UserAvatar src={user?.picture} name={user?.name} size="small" />;

  return (
    <Box direction="row" align="center" gap="small">
      {currentLeague && (
        <Text size="small" color="text-weak">
          {currentLeague.name}
        </Text>
      )}
      <Menu
        icon={userAvatar}
        items={[
          {
            label: user?.name || user?.email || 'User',
            disabled: true,
          },
          {
            label: 'Logout',
            onClick: logout,
            icon: <Logout size="small" />,
          },
        ]}
      />
    </Box>
  );
};
