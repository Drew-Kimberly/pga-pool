import { Box, Heading, Paragraph, Text } from 'grommet';

import { withPageLayout } from './withPageLayout';

const PrivacyPolicyPageComponent = () => {
  const lastUpdated = new Date('2025-01-24').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box pad="medium" width={{ max: 'large' }} margin={{ horizontal: 'auto' }}>
      <Heading level={1}>Privacy Policy</Heading>
      <Text color="text-weak" margin={{ bottom: 'medium' }}>
        Last updated: {lastUpdated}
      </Text>

      <Heading level={2}>Introduction</Heading>
      <Paragraph>
        PGA Pool (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is
        committed to protecting your personal data. This privacy policy explains how we collect,
        use, disclose, and safeguard your information when you use our PGA tournament pool
        application.
      </Paragraph>

      <Heading level={2}>Information We Collect</Heading>
      <Paragraph>
        We collect information you provide directly to us, such as when you create an account,
        participate in a pool, or contact us. This may include:
      </Paragraph>
      <Box as="ul" margin={{ left: 'medium', bottom: 'medium' }}>
        <li>Name and email address</li>
        <li>Facebook profile information (if you log in with Facebook)</li>
        <li>Pool selections and tournament preferences</li>
        <li>Communication preferences</li>
      </Box>

      <Heading level={2}>How We Use Your Information</Heading>
      <Paragraph>We use the information we collect to:</Paragraph>
      <Box as="ul" margin={{ left: 'medium', bottom: 'medium' }}>
        <li>Provide, maintain, and improve our services</li>
        <li>Process your pool entries and track scores</li>
        <li>Send you updates about tournaments and your pool standings</li>
        <li>Respond to your comments, questions, and requests</li>
        <li>Monitor and analyze trends, usage, and activities</li>
        <li>
          Detect, investigate, and prevent fraudulent transactions and other illegal activities
        </li>
      </Box>

      <Heading level={2}>Facebook Login</Heading>
      <Paragraph>
        If you choose to log in using Facebook, we access only the basic profile information that
        you have made public on Facebook, including your name, email address, and profile picture.
        We do not post to Facebook on your behalf without your explicit permission.
      </Paragraph>

      <Heading level={2}>Data Sharing</Heading>
      <Paragraph>
        We do not sell, trade, or otherwise transfer your personal information to third parties. We
        may share your information only in the following circumstances:
      </Paragraph>
      <Box as="ul" margin={{ left: 'medium', bottom: 'medium' }}>
        <li>With your consent or at your direction</li>
        <li>To comply with legal obligations</li>
        <li>To protect our rights, privacy, safety, or property</li>
        <li>
          In connection with a merger, sale, or acquisition of all or a portion of our company
        </li>
      </Box>

      <Heading level={2}>Data Security</Heading>
      <Paragraph>
        We implement appropriate technical and organizational measures to protect your personal
        information against unauthorized access, alteration, disclosure, or destruction. However, no
        method of transmission over the Internet or electronic storage is 100% secure.
      </Paragraph>

      <Heading level={2}>Data Retention</Heading>
      <Paragraph>
        We retain your personal information for as long as necessary to provide our services and
        fulfill the purposes described in this policy. You may request deletion of your account and
        associated data at any time through our Data Deletion page.
      </Paragraph>

      <Heading level={2}>Your Rights</Heading>
      <Paragraph>You have the right to:</Paragraph>
      <Box as="ul" margin={{ left: 'medium', bottom: 'medium' }}>
        <li>Access and receive a copy of your personal data</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your personal data</li>
        <li>Object to or restrict processing of your data</li>
        <li>Withdraw consent at any time</li>
      </Box>

      <Heading level={2}>Children&apos;s Privacy</Heading>
      <Paragraph>
        Our service is not intended for children under 13 years of age. We do not knowingly collect
        personal information from children under 13.
      </Paragraph>

      <Heading level={2}>Changes to This Policy</Heading>
      <Paragraph>
        We may update this privacy policy from time to time. We will notify you of any changes by
        posting the new policy on this page and updating the &quot;Last updated&quot; date.
      </Paragraph>

      <Heading level={2}>Contact Us</Heading>
      <Paragraph>
        If you have any questions about this privacy policy or our data practices, please contact us
        at privacy@pga-pool.drewk.dev
      </Paragraph>
    </Box>
  );
};

export const PrivacyPolicyPage = withPageLayout(PrivacyPolicyPageComponent);
