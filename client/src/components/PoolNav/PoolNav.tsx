import { Box, Button, Text } from 'grommet';
import React from 'react';
import { useNavigate } from 'react-router';

import { useThemeContext } from '../../contexts/ThemeContext';

import { PoolNavModel } from './usePoolNavModel';

export interface PoolNavProps {
  model: PoolNavModel;
  mobile: boolean;
}

interface PoolNavItem {
  key: 'leaderboard' | 'tournaments' | 'standings';
  label: string;
  href: string;
}

export function PoolNav({ model, mobile }: PoolNavProps) {
  const navigate = useNavigate();
  const { darkMode } = useThemeContext();
  const activeBackground = darkMode ? '#2b62c8' : 'brand';
  const activeBorder = darkMode ? '#8eb3ff' : '#273344';
  const inactiveTextColor = darkMode ? 'light-3' : undefined;
  const items: PoolNavItem[] = [
    { key: 'leaderboard', label: 'Leaderboard', href: model.leaderboardPath },
    { key: 'tournaments', label: 'Tournaments', href: model.tournamentsPath },
    { key: 'standings', label: 'Standings', href: model.standingsPath },
  ];

  const navItems = items.map((item) => {
    const active = model.activeSection === item.key;
    return (
      <Box key={item.key} flex pad={mobile ? { horizontal: 'xsmall' } : undefined}>
        <Button
          plain
          a11yTitle={item.label}
          onClick={() => navigate(item.href)}
          label={
            <Box
              align="center"
              justify="center"
              pad={mobile ? { vertical: 'small' } : { vertical: 'xsmall', horizontal: 'small' }}
              round="small"
              background={active ? activeBackground : undefined}
              border={active ? { size: 'xsmall', color: activeBorder } : undefined}
              style={
                active && darkMode
                  ? {
                      boxShadow:
                        '0 0 0 1px rgba(142, 179, 255, 0.35), 0 6px 18px rgba(43, 98, 200, 0.35)',
                    }
                  : undefined
              }
            >
              <Text
                size={mobile ? 'small' : 'medium'}
                weight={active ? 'bold' : undefined}
                color={active ? 'white' : inactiveTextColor}
                textAlign="center"
              >
                {item.label}
              </Text>
            </Box>
          }
        />
      </Box>
    );
  });

  if (!mobile) {
    return (
      <Box
        as="nav"
        direction="row"
        justify="center"
        align="center"
        pad={{ horizontal: 'medium', vertical: 'small' }}
        gap="xsmall"
        border={{ side: 'bottom', color: 'border', size: 'xsmall' }}
        background="background"
      >
        {navItems}
      </Box>
    );
  }

  return (
    <>
      <Box height="72px" />
      <Box
        as="nav"
        direction="row"
        justify="between"
        align="center"
        pad={{ horizontal: 'xsmall', vertical: 'xsmall' }}
        background="background"
        border={{ side: 'top', color: 'border', size: 'xsmall' }}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        }}
      >
        {navItems}
      </Box>
    </>
  );
}
