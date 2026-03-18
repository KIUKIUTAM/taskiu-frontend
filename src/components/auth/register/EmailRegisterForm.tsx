import React, { useRef, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { ControllerRenderProps, ControllerFieldState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation, Trans } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Turnstile } from '@marsidev/react-turnstile';
import { Link, useNavigate } from 'react-router-dom';
import { useEmailRegister } from '@/hooks/auth/useEmailRegister';
import { TURNSTILE_SITE_KEY } from '@/config/TurnstileProperty';

import { Form, Input, Button, Checkbox, Modal, Result, message, theme } from 'antd';

// ─── Schema ────────────────────────────────────────────────────────────────────

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

// ─── Email Field ────────────────────────────────────────────────────────────────

interface EmailFieldProps {
  field: ControllerRenderProps<RegisterFormValues, 'email'>;
  fieldState: ControllerFieldState;
  submitCount: number;
  label: string;
  disabled: boolean;
}

const EmailField: React.FC<EmailFieldProps> = ({
  field,
  fieldState: { error, isTouched },
  submitCount,
  label,
  disabled,
}) => {
  const hasTypedRef = useRef(false);

  if (field.value) {
    hasTypedRef.current = true;
  }

  const showError = !!error && (
    (hasTypedRef.current && isTouched) || submitCount > 0
  );

  return (
    <Form.Item
      label={label}
      validateStatus={showError ? 'error' : ''}
      help={showError ? error?.message : ''}
    >
      <Input
        {...field}
        size="large"
        placeholder="you@example.com"
        disabled={disabled}
      />
    </Form.Item>
  );
};

// ─── Password Field ─────────────────────────────────────────────────────────────

interface PasswordFieldProps {
  field: ControllerRenderProps<RegisterFormValues, 'password' | 'confirmPassword'>;
  fieldState: ControllerFieldState;
  submitCount: number;
  label: string;
  disabled: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  field,
  fieldState: { error, isTouched },
  submitCount,
  label,
  disabled,
}) => {
  const hasTypedRef = useRef(false);

  if (field.value) {
    hasTypedRef.current = true;
  }

  const showError = !!error && (
    (hasTypedRef.current && isTouched) || submitCount > 0
  );

  return (
    <Form.Item
      label={label}
      validateStatus={showError ? 'error' : ''}
      help={showError ? error?.message : ''}
    >
      <Input.Password
        {...field}
        size="large"
        placeholder="••••••••"
        disabled={disabled}
      />
    </Form.Item>
  );
};

// ─── Main Form ──────────────────────────────────────────────────────────────────

export const EmailRegisterForm: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  const { token: themeToken } = theme.useToken();
  const { login: emailRegister, isLoading: isEmailLoading, isSuccess } = useEmailRegister();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, submitCount },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: RegisterFormValues) => {
    if (!token) {
      message.error(t('pleaseWaitForVerification', { ns: 'toast' }));
      return;
    }
    emailRegister({ email: data.email, password: data.password, humanVerifyToken: token });
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      setToken(null);
    }
  }, [isSuccess, reset]);

  const handleGoHome = () => {
    navigate('/');
  };

  const isButtonDisabled = isSubmitting || isEmailLoading || !token || !isValid;
  const fieldDisabled = isSubmitting || isEmailLoading || isSuccess;

  return (
    <>
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        className="w-full"
        requiredMark={false}
      >
        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <EmailField
              field={field}
              fieldState={fieldState}
              submitCount={submitCount}
              label={t('emailAddress', { ns: 'common' })}
              disabled={fieldDisabled}
            />
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <PasswordField
              field={field as ControllerRenderProps<RegisterFormValues, 'password' | 'confirmPassword'>}
              fieldState={fieldState}
              submitCount={submitCount}
              label={t('password', { ns: 'common' })}
              disabled={fieldDisabled}
            />
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <PasswordField
              field={field as ControllerRenderProps<RegisterFormValues, 'password' | 'confirmPassword'>}
              fieldState={fieldState}
              submitCount={submitCount}
              label={t('confirmPassword', { ns: 'auth' })}
              disabled={fieldDisabled}
            />
          )}
        />

        {/* Terms of Service */}
        <Form.Item>
          <div className="flex items-center">
            <Checkbox required disabled={isSuccess} className="text-sm">
              <Trans
                i18nKey="agreeToTerms"
                ns="auth"
                components={{
                  1: (
                    <Link
                      to="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: themeToken.colorPrimary }}
                      className="hover:underline"
                    >
                      Terms
                    </Link>
                  ),
                }}
              />
            </Checkbox>
          </div>
        </Form.Item>

        {/* Turnstile */}
        <div className="my-4">
          {!isSuccess && (
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={(token) => setToken(token)}
              onError={() => setToken(null)}
              onExpire={() => setToken(null)}
              options={{ theme: 'light', size: 'flexible' }}
            />
          )}
        </div>

        {/* Submit */}
        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isSubmitting || isEmailLoading}
            disabled={isButtonDisabled || isSuccess}
          >
            {isSubmitting || isEmailLoading
              ? t('creatingAccount', { ns: 'auth' })
              : t('createAccount', { ns: 'auth' })}
          </Button>
        </Form.Item>
      </Form>

      {/* Success Modal */}
      <Modal
        open={isSuccess}
        onCancel={handleGoHome}
        footer={null}
        centered
        maskClosable={false}
        width={400}
      >
        <Result
          status="success"
          title={t('registrationSuccess', { ns: 'auth', defaultValue: '註冊成功！' })}
          subTitle={t('accountCreatedDesc', {
            ns: 'auth',
            defaultValue: '您的帳號已成功建立。請前往首頁開始使用。',
          })}
          extra={[
            <Button type="primary" key="home" onClick={handleGoHome} block>
              {t('goToHome', { ns: 'common', defaultValue: '前往首頁' })}
            </Button>,
          ]}
        />
      </Modal>
    </>
  );
};
