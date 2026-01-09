import React, { useState, useRef, useEffect } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle2, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEmailSend } from '@/hooks/auth/useEmailSend';
import { useEmailVerify } from '@/hooks/auth/useEmailVerify';
import { useAuth } from '@/hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useTranslation(['common', 'auth']);

  const { data: user } = useAuth();
  const { sendVerifyEmail, isSending } = useEmailSend();
  const { verifyEmail, isVerifying, isVerifySuccess } = useEmailVerify();

  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  // useEffect(() => {
  //   if (user?.verified) {
  //     navigate('/dashboard', { replace: true });
  //   }
  // }, [user, navigate]);
  // Handle input change
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (Number.isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val) => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verifyCode = otp.join('');
    verifyEmail(verifyCode);
  };

  const handleSendCode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (timer > 0 || isSending) return;

    setTimer(60);
    sendVerifyEmail();
    console.log('Sending code...');
  };

  useEffect(() => {
    let interval: number | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Refactor 1: Extract nested ternary into an independent statement/function
  const renderResendContent = () => {
    if (isSending) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }

    if (timer > 0) {
      return <span>{timer}s</span>;
    }

    return (
      <>
        <Send className="w-3 h-3" />
        {t('resend', { ns: 'auth' })}
      </>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {isVerifySuccess ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <Mail className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isVerifySuccess
                ? t('verifysuccess', { ns: 'auth' })
                : t('verifyEmail', { ns: 'auth' })}
            </h2>
            <p className="text-gray-500 text-sm">
              {isVerifySuccess
                ? t('youCanNowCloseThisPageOrContinue', { ns: 'auth' })
                : t('weHaveSentA6DigitVerificationCode', {
                    email: user?.email || 'your email',
                    ns: 'auth',
                  })}
            </p>
          </div>

          {/* Refactor 2: Fix negated condition (!isVerifySuccess) by swapping blocks */}
          {isVerifySuccess ? (
            <div className="text-center">
              <button className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors">
                {t('goToDashboard', { ns: 'auth' })}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between gap-2 mb-8">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={otp.join('').length < 6 || isVerifying}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('verifying', { ns: 'auth' })}
                  </>
                ) : (
                  <>
                    {t('verify', { ns: 'auth' })}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-sm text-gray-500 font-medium">
                  {t('didNotReceiveVerificationCode', { ns: 'auth' })}
                </span>

                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={timer > 0 || isSending}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                    ${
                      timer > 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-sm'
                    }
                  `}
                >
                  {/* Using the extracted function here */}
                  {renderResendContent()}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
