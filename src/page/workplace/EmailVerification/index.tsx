import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle2, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ConfigProvider, Typography, Input, theme, GetProps } from 'antd';

// Assume hook paths are unchanged
import { useEmailSend } from '@/hooks/auth/useEmailSend';
import { useEmailVerify } from '@/hooks/auth/useEmailVerify';
import { useAuth } from '@/hooks/auth/useAuth';

const { Title, Text } = Typography;

// Define OTP Input Props type (Antd v5.13+ / v6)
type OTPProps = GetProps<typeof Input.OTP>;

const EmailVerification = () => {
  const { t } = useTranslation(['common', 'auth']);
  const navigate = useNavigate();

  // Use Antd token to get current theme variables (if needed)
  const { token } = theme.useToken();

  // State management: only need one string now, no array
  const [otpValue, setOtpValue] = useState<string>('');
  const [timer, setTimer] = useState(0);

  const { data: user } = useAuth();
  const { sendVerifyEmail, isSending } = useEmailSend();
  const { verifyEmail, isVerifying, isVerifySuccess } = useEmailVerify();

  const showSuccessUI = isVerifySuccess || (user?.verified && isVerifySuccess);

  // Navigation logic
  useEffect(() => {
    if (user?.verified && !isVerifySuccess) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isVerifySuccess, navigate]);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle sending verification code
  const handleSendCode = () => {
    if (timer > 0 || isSending) return;
    setTimer(60);
    sendVerifyEmail();
    console.log('Sending code...');
  };

  // Handle submission
  const handleSubmit = () => {
    if (otpValue.length === 6) {
      verifyEmail(otpValue);
    }
  };

  // Antd Input.OTP onChange event
  const handleOtpChange: OTPProps['onChange'] = (text) => {
    setOtpValue(text);
  };

  // Render resend button content
  const renderResendButton = () => {
    if (timer > 0) {
      return <span className="text-gray-400">{timer}s</span>;
    }
    return (
      <div className="flex items-center gap-2">
        <Send size={14} />
        <span>{t('resend', { ns: 'auth' })}</span>
      </div>
    );
  };

  return (
    // Use ConfigProvider to override Antd default theme color to match original blue style
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb', // blue-600
          borderRadius: 12,
          controlHeightLG: 48,
        },
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <Card
          variant={'outlined'}
          className="max-w-md w-full shadow-xl overflow-hidden"
          styles={{ body: { padding: '2rem' } }}
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {showSuccessUI ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <Mail className="w-8 h-8 text-blue-600" />
              )}
            </div>

            <Title level={2} style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {showSuccessUI
                ? t('verifysuccess', { ns: 'auth' })
                : t('verifyEmail', { ns: 'auth' })}
            </Title>

            <Text type="secondary">
              {showSuccessUI
                ? t('youCanNowCloseThisPageOrContinue', { ns: 'auth' })
                : t('weHaveSentA6DigitVerificationCode', {
                    email: user?.email || 'your email',
                    ns: 'auth',
                  })}
            </Text>
          </div>

          {/* Content Section */}
          {showSuccessUI ? (
            <div className="text-center">
              <Button
                type="primary"
                size="large"
                block
                onClick={() => navigate('/dashboard', { replace: true })}
                className="bg-gray-900 hover:bg-gray-800 border-gray-900"
              >
                {t('goToDashboard', { ns: 'auth' })}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* OTP Input Section */}
              <div className="flex justify-center py-2">
                <Input.OTP
                  length={6}
                  value={otpValue}
                  onChange={handleOtpChange}
                  size="large"
                  style={{ gap: '8px' }}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSubmit}
                loading={isVerifying}
                disabled={otpValue.length < 6}
                icon={!isVerifying && <ArrowRight size={18} />}
                iconPlacement="end"
              >
                {t('verify', { ns: 'auth' })}
              </Button>

              {/* Resend Section */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-sm text-gray-500 font-medium">
                  {t('didNotReceiveVerificationCode', { ns: 'auth' })}
                </span>

                <Button
                  type={'default'}
                  onClick={handleSendCode}
                  disabled={timer > 0 || isSending}
                  loading={isSending}
                  className={`
                    ${
                      timer > 0
                        ? 'bg-gray-200 border-gray-200 text-gray-400'
                        : 'bg-white text-blue-600 border-blue-200 hover:text-blue-700 hover:border-blue-300'
                    }
                  `}
                  style={{ height: 'auto', padding: '6px 16px' }}
                >
                  {renderResendButton()}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default EmailVerification;
