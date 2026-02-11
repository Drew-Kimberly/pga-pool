import { Anchor, Box, Footer as GrommetFooter, Text } from 'grommet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
`;

export const Footer = () => {
  return (
    <GrommetFooter
      background="background-contrast"
      pad={{ horizontal: 'medium', vertical: 'small' }}
      margin={{ top: 'large' }}
    >
      <Box direction="row" gap="medium" align="center">
        <Text size="small">© {new Date().getFullYear()} PGA Pool</Text>
        <Anchor as={StyledLink} to="/privacy" label="Privacy Policy" size="small" />
        <Anchor as={StyledLink} to="/data-deletion" label="Data Deletion" size="small" />
      </Box>
    </GrommetFooter>
  );
};
