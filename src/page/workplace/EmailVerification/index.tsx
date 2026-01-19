import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle2, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ConfigProvider, Typography, Input, theme, GetProps } from 'antd';

// 假設這些 hooks 的路徑不變
import { useEmailSend } from '@/hooks/auth/useEmailSend';
import { useEmailVerify } from '@/hooks/auth/useEmailVerify';
import { useAuth } from '@/hooks/auth/useAuth';

const { Title, Text } = Typography;

// 定義 OTP Input 的 Props 類型 (Antd v5.13+ / v6)
type OTPProps = GetProps<typeof Input.OTP>;

const EmailVerification = () => {
  const { t } = useTranslation(['common', 'auth']);
  const navigate = useNavigate();

  // 使用 Antd 的 token 來獲取當前主題變數 (如果需要)
  const { token } = theme.useToken();

  // 狀態管理：現在只需要一個 string，不需要 array
  const [otpValue, setOtpValue] = useState<string>('');
  const [timer, setTimer] = useState(0);

  const { data: user } = useAuth();
  const { sendVerifyEmail, isSending } = useEmailSend();
  const { verifyEmail, isVerifying, isVerifySuccess } = useEmailVerify();

  const showSuccessUI = isVerifySuccess || (user?.verified && isVerifySuccess);

  // 導航邏輯
  useEffect(() => {
    if (user?.verified && !isVerifySuccess) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isVerifySuccess, navigate]);

  // 計時器邏輯
  useEffect(() => {
    let interval: number | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 處理發送驗證碼
  const handleSendCode = () => {
    if (timer > 0 || isSending) return;
    setTimer(60);
    sendVerifyEmail();
    console.log('Sending code...');
  };

  // 處理提交
  const handleSubmit = () => {
    if (otpValue.length === 6) {
      verifyEmail(otpValue);
    }
  };

  // Antd Input.OTP 的 onChange 事件
  const handleOtpChange: OTPProps['onChange'] = (text) => {
    setOtpValue(text);
  };

  // 渲染重發按鈕內容
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
    // 使用 ConfigProvider 覆蓋 Antd 默認主題色以匹配原本的藍色風格
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
