import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation, Trans } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Loader, CheckCircle } from 'lucide-react'; // 新增 CheckCircle 圖示
import { Turnstile } from '@marsidev/react-turnstile';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // 1. 引入導航 Hook
import { useEmailRegister } from '@/hooks/auth/useEmailRegister';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';

const createRegisterSchema = (t: TFunction) => {
  return z
    .object({
      email: z.email({ message: t('email.invalid', { ns: 'auth' }) }),
      password: z
        .string()
        .min(6, { message: t('password.minLength', { ns: 'auth' }) })
        .max(20, { message: t('password.maxLength', { ns: 'auth' }) })
        .regex(/[a-z]/, { message: t('password.lowercase', { ns: 'auth' }) })
        .regex(/[A-Z]/, { message: t('password.uppercase', { ns: 'auth' }) })
        .regex(/\d/, { message: t('password.digit', { ns: 'auth' }) }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('password.mismatch', { ns: 'auth' }),
      path: ['confirmPassword'],
    });
};

type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

export const EmailRegisterForm: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate(); // 2. 初始化 navigate
  const [token, setToken] = useState<string | null>(null);
  const SITE_KEY = '0x4AAAAAACLC2eG_l7H3PQ5A';

  const {
    login: emailRegister,
    isLoading: isEmailLoading,
    isError: isEmailError,
    isSuccess, // 3. 解構出 isSuccess
  } = useEmailRegister();

  const {
    register,
    handleSubmit,
    reset, // 解構 reset
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onEmailRegister = (data: RegisterFormValues, humanVerifyToken: string) => {
    emailRegister({ email: data.email, password: data.password, humanVerifyToken });
  };

  const onSubmit = (data: RegisterFormValues) => {
    if (!token) {
      toast.error(t('pleaseWaitForVerification', { ns: 'error' }));
      return;
    }
    onEmailRegister(data, token);
  };

  // 4. 使用 useEffect 處理成功後的副作用 (重置表單)
  useEffect(() => {
    if (isSuccess) {
      reset(); // 清空表單
      setToken(null); // 清除驗證 token
    }
  }, [isSuccess, reset]);

  // 5. 處理導航到首頁
  const handleGoHome = () => {
    navigate('/'); // 這裡填寫你要跳轉的路徑，例如 '/' 或 '/login'
  };

  const isButtonDisabled = isSubmitting || isEmailLoading || !token || !isValid;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* ... (省略 Input 欄位程式碼，保持原樣) ... */}

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('emailAddress', { ns: 'common' })}
          </label>
          <input
            type="email"
            id="register-email"
            {...register('email')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="you@example.com"
            disabled={isSubmitting || isEmailLoading || isSuccess} // 成功後也禁用
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t('password', { ns: 'common' })}
          </label>
          <input
            type="password"
            id="register-password"
            {...register('password')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isSubmitting || isEmailLoading || isSuccess}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t('confirmPassword', { ns: 'auth' })}
          </label>
          <input
            type="password"
            id="confirm-password"
            {...register('confirmPassword')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isSubmitting || isEmailLoading || isSuccess}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms of Service */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
              disabled={isSuccess}
            />
          </div>
          <div className="ml-2 text-sm">
            <Trans
              i18nKey="agreeToTerms"
              ns="auth"
              components={{
                1: (
                  <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                    Terms
                  </a>
                ),
              }}
            />
          </div>
        </div>

        {/* Turnstile component */}
        <div className="my-4">
          {!isSuccess && ( // 成功後隱藏 Turnstile
            <Turnstile
              siteKey={SITE_KEY}
              onSuccess={(token) => setToken(token)}
              onError={() => setToken(null)}
              onExpire={() => setToken(null)}
              options={{ theme: 'light', size: 'flexible' }}
            />
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isButtonDisabled || isSuccess}
          className={`w-full text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 
            ${
              isButtonDisabled || isSuccess
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {(isSubmitting || isEmailLoading) && <Loader className="animate-spin w-5 h-5" />}
          {isSubmitting || isEmailLoading
            ? t('creatingAccount', { ns: 'auth' })
            : t('createAccount', { ns: 'auth' })}
        </button>
      </form>

      {/* 6. Success Modal */}
      <Dialog open={isSuccess} onOpenChange={(open) => !open && handleGoHome()}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              {t('registrationSuccess', { ns: 'auth', defaultValue: '註冊成功！' })}
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              {t('accountCreatedDesc', {
                ns: 'auth',
                defaultValue: '您的帳號已成功建立。請前往首頁開始使用。',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button type="button" className="w-full sm:w-auto min-w-[120px]" onClick={handleGoHome}>
              {t('goToHome', { ns: 'common', defaultValue: '前往首頁' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
