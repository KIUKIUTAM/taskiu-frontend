import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Loader } from 'lucide-react';

// --- 1. 定義 Schema 生成器 (放在 Component 外面) ---
const createLoginSchema = (t: TFunction) => {
  return z.object({
    // 修正: 必須先定義為 string，且參數用 message
    email: z.email({ message: t('email.invalid') }),
    password: z.string(),
    //.min(6, { message: t('password.invalid') }),
    // .max(20, { message: t('password.invalid') })
    // .regex(/[a-z]/, { message: t('password.invalid') })
    // .regex(/[A-Z]/, { message: t('password.invalid') })
    // .regex(/\d/, { message: t('password.invalid') }),
  });
};

// 推導型別
type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

interface Props {
  onEmailLogin: ({ email, password }: { email: string; password: string }) => void;
  isEmailLoading?: boolean;
}

export const EmailLoginForm: React.FC<Props> = ({ onEmailLogin, isEmailLoading }) => {
  const { t } = useTranslation(['auth', 'common']);

  // --- 2. 初始化 React Hook Form ---
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  // --- 3. 提交處理 ---
  const onSubmit = (data: LoginFormValues) => {
    onEmailLogin({ email: data.email, password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Email entity */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('emailAddress', { ns: 'common' })}
        </label>
        <input
          type="email"
          id="email"
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {t('password', { ns: 'common' })}
        </label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="••••••••"
          disabled={isSubmitting}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {/* 底部功能區 */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center">
          <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
          <span className="ml-2 text-gray-600">{t('rememberMe', { ns: 'common' })}</span>
        </label>
        <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
          {t('forgotPassword', { ns: 'common' })}
        </a>
      </div>
      {/* 註冊連結 */}
      <p className="mt-6 text-center text-sm text-gray-600">
        {t('dontHaveAccount', { ns: 'common' })}{' '}
        <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          {t('signUp', { ns: 'common' })}
        </a>
      </p>
      {/* 提交按鈕 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
      >
        {isSubmitting || isEmailLoading ? <Loader className="animate-spin mx-auto" /> : <></>}
        {isSubmitting || isEmailLoading ? 'Loading...' : t('signIn', { ns: 'common' })}
      </button>
    </form>
  );
};
