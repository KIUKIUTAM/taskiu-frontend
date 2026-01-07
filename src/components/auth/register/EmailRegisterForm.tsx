import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation, Trans } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Loader } from 'lucide-react';

// --- 1. 定義 Schema 生成器 ---
const createRegisterSchema = (t: TFunction) => {
  return z
    .object({
      email: z.email({ message: t('email.invalid', { ns: 'common' }) }),
      password: z
        .string()
        .min(6, { message: t('password.min', { ns: 'auth' }) }) // 最少6碼
        .max(20, { message: t('password.max', { ns: 'auth' }) }) // 最多20碼
        .regex(/[a-z]/, { message: t('password.lowercase', { ns: 'auth' }) }) // 需含小寫
        .regex(/[A-Z]/, { message: t('password.uppercase', { ns: 'auth' }) }) // 需含大寫
        .regex(/\d/, { message: t('password.digit', { ns: 'auth' }) }), // 需含數字
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('password.mismatch', { ns: 'auth' }),
      path: ['confirmPassword'],
    });
};

// 推導型別
type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

interface Props {
  onEmailRegister: (data: RegisterFormValues) => void;
  isEmailLoading?: boolean;
}

export const EmailRegisterForm: React.FC<Props> = ({ onEmailRegister, isEmailLoading }) => {
  const { t } = useTranslation(['auth', 'common']);

  // --- 2. 初始化 React Hook Form ---
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit', // 或是 'onBlur' 讓使用者離開欄位時即驗證
  });

  // --- 3. 提交處理 ---
  const onSubmit = (data: RegisterFormValues) => {
    onEmailRegister(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Email 欄位 */}
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
          disabled={isSubmitting || isEmailLoading}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Password 欄位 */}
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
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
          disabled={isSubmitting || isEmailLoading}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {/* Confirm Password 欄位 */}
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
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
          disabled={isSubmitting || isEmailLoading}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* 服務條款 Checkbox (可選) */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
        </div>
        <div className="ml-2 text-sm">
          <Trans
            i18nKey="agreeToTerms"
            ns="auth"
            components={{
              1: (
                <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                  null
                </a>
              ),
            }}
          />
        </div>
      </div>

      {/* 提交按鈕 */}
      <button
        type="submit"
        disabled={isSubmitting || isEmailLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {(isSubmitting || isEmailLoading) && <Loader className="animate-spin w-5 h-5" />}
        {isSubmitting || isEmailLoading
          ? t('creatingAccount', { ns: 'auth' })
          : t('createAccount', { ns: 'auth' })}
      </button>
    </form>
  );
};
