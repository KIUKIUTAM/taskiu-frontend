import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Flex } from 'antd';
import GoogleIcon from '@/assets/svg/GoogleIcon';
import GitHubIcon from '@/assets/svg/GitHubIcon';

interface Props {
  onGoogleLogin?: () => void;
  onGitHubLogin?: () => void;
  isGoogleLoading?: boolean;
  isGitHubLoading?: boolean;
}

export const SocialLoginSection: React.FC<Props> = ({
  onGoogleLogin,
  onGitHubLogin,
  isGoogleLoading,
  isGitHubLoading,
}) => {
  const { t } = useTranslation('common');

  return (
    <Flex vertical gap="middle" className="mb-6">
      <Button
        block
        size="large"
        onClick={onGoogleLogin}
        loading={isGoogleLoading}
        disabled={isGitHubLoading}
        icon={!isGoogleLoading && <GoogleIcon />}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isGoogleLoading ? 'Logging in...' : t('continueWithGoogle')}
      </Button>

      <Button
        block
        size="large"
        onClick={onGitHubLogin}
        loading={isGitHubLoading}
        disabled={isGoogleLoading}
        icon={!isGitHubLoading && <GitHubIcon />}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isGitHubLoading ? 'Logging in...' : t('continueWithGitHub')}
      </Button>
    </Flex>
  );
};
