import React from 'react';
import { useForm, Controller } from 'react-hook-form'; // 引入 Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import { Form, Input, Button, Checkbox, theme } from 'antd';

const LoginSchema = (t: TFunction) => {
  return z.object({
    email: z.email({ message: t('email.invalid', { ns: 'auth' }) }),
    password: z.string().min(1, { message: t('password.required', { ns: 'auth' }) }),
  });
};

type LoginFormValues = z.infer<ReturnType<typeof LoginSchema>>;

interface Props {
  onEmailLogin: ({ email, password }: { email: string; password: string }) => void;
  isEmailLoading?: boolean;
}

export const EmailLoginForm: React.FC<Props> = ({ onEmailLogin, isEmailLoading }) => {
  const { t } = useTranslation(['auth', 'common']);
  const { token } = theme.useToken(); // 獲取主題顏色用於連結

  // --- 2. 初始化 React Hook Form ---
  const {
    control, // 需要 control 給 Controller 使用
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema(t)),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = (data: LoginFormValues) => {
    onEmailLogin({ email: data.email, password: data.password });
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      className="w-full"
      requiredMark={false}
    >
      {/* Email Field */}
      <Form.Item
        label={t('emailAddress', { ns: 'common' })}
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              size="large"
              placeholder="you@example.com"
              disabled={isSubmitting || isEmailLoading}
            />
          )}
        />
      </Form.Item>

      {/* Password Field */}
      <Form.Item
        label={t('password', { ns: 'common' })}
        validateStatus={errors.password ? 'error' : ''}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              size="large"
              placeholder="••••••••"
              disabled={isSubmitting || isEmailLoading}
            />
          )}
        />
      </Form.Item>

      {/* 底部功能區 (Remember Me & Forgot Password) */}
      <div className="flex items-center justify-between mb-6">
        <Form.Item noStyle>
          <Checkbox className="text-gray-600">{t('rememberMe', { ns: 'common' })}</Checkbox>
        </Form.Item>

        <a
          href="/forgot-password"
          className="text-sm font-medium hover:underline"
          style={{ color: token.colorPrimary }}
        >
          {t('forgotPassword', { ns: 'common' })}
        </a>
      </div>

      {/* 提交按鈕 */}
      <Form.Item className="mb-4">
        <Button
          type="default"
          htmlType="submit"
          size="large"
          block
          loading={isSubmitting || isEmailLoading}
          disabled={isSubmitting || isEmailLoading}
          className="hover:!bg-blue-950 hover:!text-white hover:!border-blue-950 transition-all"
        >
          {isSubmitting || isEmailLoading ? 'Loading...' : t('signIn', { ns: 'common' })}
        </Button>
      </Form.Item>

      {/* 註冊連結 */}
      <div className="text-center text-sm text-gray-600">
        {t('dontHaveAccount', { ns: 'common' })}{' '}
        <a
          href="/register"
          className="font-medium hover:underline"
          style={{ color: token.colorPrimary }}
        >
          {t('signUp', { ns: 'common' })}
        </a>
      </div>
    </Form>
  );
};
