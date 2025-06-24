import { Box, Button, Heading, Paragraph, Text } from 'grommet';
import { Alert, Trash } from 'grommet-icons';
import { useState } from 'react';

import { withPageLayout } from './withPageLayout';

const DataDeletionPageComponent = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = async () => {
    setIsDeleting(true);

    // In a real implementation, this would call an API endpoint
    // For now, we'll simulate the process
    setTimeout(() => {
      setIsDeleting(false);
      alert(
        'Your data deletion request has been submitted. You will receive a confirmation email.'
      );
      setShowConfirmation(false);
    }, 2000);
  };

  return (
    <Box pad="medium" width={{ max: 'large' }} margin={{ horizontal: 'auto' }}>
      <Heading level={1}>Data Deletion</Heading>

      <Box gap="medium">
        <Paragraph>
          We respect your right to privacy and provide you with the ability to delete your personal
          data from our systems. This page allows you to request the deletion of your account and
          all associated data.
        </Paragraph>

        <Heading level={2}>What Data Will Be Deleted</Heading>
        <Paragraph>
          When you request data deletion, the following information will be permanently removed:
        </Paragraph>
        <Box as="ul" margin={{ left: 'medium', bottom: 'medium' }}>
          <li>Your account information (name, email, profile data)</li>
          <li>All pool entries and selections</li>
          <li>Historical tournament participation data</li>
          <li>Any Facebook login associations</li>
          <li>Communication preferences and settings</li>
        </Box>

        <Heading level={2}>What Data May Be Retained</Heading>
        <Paragraph>
          We may retain certain information as required by law or for legitimate business purposes,
          such as:
        </Paragraph>
        <Box as="ul" margin={{ left: 'medium', bottom: 'medium' }}>
          <li>Transaction records for financial reporting</li>
          <li>Data necessary to resolve disputes or enforce our terms</li>
          <li>Anonymized and aggregated data that cannot identify you</li>
        </Box>

        <Heading level={2}>Data Deletion Process</Heading>
        <Box gap="small">
          <Paragraph>To request deletion of your data:</Paragraph>
          <Box as="ol" margin={{ left: 'medium' }}>
            <li>Click the &quot;Request Data Deletion&quot; button below</li>
            <li>Confirm your request in the dialog that appears</li>
            <li>You will receive an email confirmation at your registered email address</li>
            <li>Your data will be deleted within 30 days</li>
            <li>You will receive a final confirmation when deletion is complete</li>
          </Box>
        </Box>

        <Box
          background="status-warning"
          pad="medium"
          round="small"
          direction="row"
          gap="small"
          margin={{ vertical: 'medium' }}
        >
          <Alert color="status-warning" />
          <Box>
            <Text weight="bold">Important Notice</Text>
            <Text size="small">
              Data deletion is permanent and cannot be undone. You will lose access to your account
              and all associated data, including your pool history and current entries.
            </Text>
          </Box>
        </Box>

        {!showConfirmation ? (
          <Box align="start">
            <Button
              primary
              label="Request Data Deletion"
              icon={<Trash />}
              onClick={() => setShowConfirmation(true)}
              color="status-critical"
            />
          </Box>
        ) : (
          <Box
            border={{ color: 'status-critical', size: 'small' }}
            pad="medium"
            round="small"
            gap="medium"
          >
            <Text weight="bold">Are you sure you want to delete your data?</Text>
            <Text>
              This action is permanent and will delete your account and all associated data. You
              will need to create a new account if you want to use PGA Pool in the future.
            </Text>
            <Box direction="row" gap="small">
              <Button
                primary
                label={isDeleting ? 'Processing...' : 'Yes, Delete My Data'}
                onClick={handleDeleteRequest}
                disabled={isDeleting}
                color="status-critical"
              />
              <Button
                label="Cancel"
                onClick={() => setShowConfirmation(false)}
                disabled={isDeleting}
              />
            </Box>
          </Box>
        )}

        <Heading level={2}>Alternative Options</Heading>
        <Paragraph>
          If you&apos;re experiencing issues with our service, consider these alternatives before
          deleting your data:
        </Paragraph>
        <Box as="ul" margin={{ left: 'medium', bottom: 'medium' }}>
          <li>Temporarily deactivate your account instead of permanent deletion</li>
          <li>Adjust your privacy settings to limit data collection</li>
          <li>Unsubscribe from email communications</li>
          <li>Contact support for assistance with any concerns</li>
        </Box>

        <Heading level={2}>Contact Us</Heading>
        <Paragraph>
          If you have questions about data deletion or need assistance, please contact our privacy
          team at privacy@pga-pool.drewk.dev or use the manual deletion request process by sending
          an email with the subject line &quot;Data Deletion Request&quot; along with your account
          email address.
        </Paragraph>
      </Box>
    </Box>
  );
};

export const DataDeletionPage = withPageLayout(DataDeletionPageComponent);
