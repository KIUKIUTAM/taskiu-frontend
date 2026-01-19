import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Typography, Divider } from 'antd';
import { SocialLoginSection } from './SocialLoginSection';
import { EmailLoginForm } from './EmailLoginForm';

const { Title, Text } = Typography;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailLogin: ({ email, password }: { email: string; password: string }) => void;
  onGoogleLogin?: () => void;
  onGitHubLogin?: () => void;
  isEmailLoading?: boolean;
  isGoogleLoading?: boolean;
  isGitHubLoading?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onEmailLogin,
  onGoogleLogin,
  onGitHubLogin,
  isEmailLoading,
  isGoogleLoading,
  isGitHubLoading,
}) => {
  const { t } = useTranslation('common');

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      destroyOnHidden={true}
      maskClosable={true}
    >
      {/* Title Section */}
      <div className="text-center mb-6 mt-2">
        <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
          {t('welcomeBack')}
        </Title>
        <Text type="secondary">{t('signInToYourAccount')}</Text>
      </div>

      {/* Social Login Section */}
      <SocialLoginSection
        onGoogleLogin={onGoogleLogin}
        onGitHubLogin={onGitHubLogin}
        isGoogleLoading={isGoogleLoading}
        isGitHubLoading={isGitHubLoading}
      />

      {/* Divider */}
      <Divider plain>
        <Text type="secondary" className="text-xs">
          {t('or', { defaultValue: 'OR' })}
        </Text>
      </Divider>

      {/* Email Form Section */}
      <EmailLoginForm onEmailLogin={onEmailLogin} isEmailLoading={isEmailLoading} />
    </Modal>
  );
};

export default LoginModal;
