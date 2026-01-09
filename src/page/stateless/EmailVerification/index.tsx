import React, { useState, useRef, useEffect } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmailVerification = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useTranslation('common');

  // Handle input change
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;

    // Only allow numbers
    if (Number.isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take the last entered character (handle some browsers autofilling multiple characters)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // If a value is entered and it's not the last box, focus the next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key events (Backspace, Arrow keys)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If the current box is empty, press Backspace to go back to the previous box
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    // Check if all characters are digits
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    // Focus on the last empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((val) => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  // todo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  // Resend timer (simulate)
  const [timer, setTimer] = useState(0);
  const handleResend = () => {
    setTimer(60);
    // Add actual resend logic here
    console.log('Resending code...');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          {/* Icon and Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {isSuccess ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <Mail className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isSuccess ? t('verifysuccess') : t('verifyEmail')}
            </h2>
            <p className="text-gray-500 text-sm">
              {isSuccess
                ? t('youCanNowCloseThisPageOrContinue')
                : t('weHaveSentA6DigitVerificationCode')}
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              {/* 6 input fields */}
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

              {/* Button */}
              <button
                type="submit"
                disabled={otp.join('').length < 6 || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('verifying')}
                  </>
                ) : (
                  <>
                    {t('verify')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <button className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors">
                {t('goToDashboard')}
              </button>
            </div>
          )}

          {/* Resend Link */}
          {!isSuccess && (
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500">
                {t('didNotReceiveVerificationCode')}{' '}
                {timer > 0 ? (
                  <span className="text-gray-400 font-medium">
                    {timer} {t('secondsBeforeResend')}
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t('resend')}
                  </button>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
