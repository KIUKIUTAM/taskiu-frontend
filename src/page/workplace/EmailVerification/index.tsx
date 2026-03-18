import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ConfigProvider, Typography, Input, GetProps } from 'antd';

import { useEmailSend } from '@/hooks/auth/useEmailSend';
import { useEmailVerify } from '@/hooks/auth/useEmailVerify';
import { useAuth } from '@/hooks/auth/useAuth';

const { Title, Text } = Typography;

type OTPProps = GetProps<typeof Input.OTP>;

const EmailVerification = () => {
  const { t: tPage } = useTranslation('page.workplace.emailVerification');
  const navigate = useNavigate();

  const [otpValue, setOtpValue] = useState<string>('');
  const [timer, setTimer] = useState(0);

  const { data: user, isLoading: isUserLoading } = useAuth();
  const { sendVerifyEmail, isSending } = useEmailSend();
  const { verifyEmail, isVerifying } = useEmailVerify();
  console.log('[EmailVerification] user:', user);
  console.log('[EmailVerification] isUserLoading:', isUserLoading);
  console.log('[EmailVerification] user?.verified:', user?.verified);
  // 已驗證直接進入此頁時，自動跳轉
  useEffect(() => {
    console.log('[useEffect] triggered - user?.verified:', user?.verified, '| user:', user);

    if (user?.verified) {
      console.log('[useEffect] navigating to /dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Timer 倒數
  useEffect(() => {
    let interval: number | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendCode = () => {
    if (timer > 0 || isSending) return;
    setTimer(60);
    sendVerifyEmail();
  };

  const handleSubmit = () => {
    if (otpValue.length === 6) {
      verifyEmail(otpValue);
    }
  };

  const handleOtpChange: OTPProps['onChange'] = (text) => {
    setOtpValue(text);
  };

  const renderResendButton = () => {
    if (timer > 0) {
      return <span className="text-gray-400">{timer}s</span>;
    }
    return (
      <div className="flex items-center gap-2">
        <Send size={14} />
        <span>{tPage('resend')}</span>
      </div>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>

            <Title level={2} style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {tPage('titleVerify')}
            </Title>

            <Text type="secondary">
              {tPage('subtitleSentCode', {
                email: user?.email || 'your email',
              })}
            </Text>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            {/* OTP Input */}
            <div className="flex justify-center py-2">
              <Input.OTP
                length={6}
                value={otpValue}
                onChange={handleOtpChange}
                size="large"
                style={{ gap: '8px' }}
                className="otp-bold"
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
              {tPage('verify')}
            </Button>

            {/* Resend Section */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-sm text-gray-500 font-medium">
                {tPage('didNotReceive')}
              </span>

              <Button
                type={'default'}
                onClick={handleSendCode}
                disabled={timer > 0 || isSending}
                loading={isSending}
                className={`
                  ${timer > 0
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
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default EmailVerification;
