import AuthNavbar from '../components/layout/navbar/AuthNavbar';
import { Link } from 'react-router-dom';
import { useRegisterUser } from '../queries/auth';
import { useState } from 'react';
import type { RegisterUserData } from '../types/auth';
import { registerSchema } from '../schemas/authSchema';
import { z } from 'zod';

export default function RegisterPage() {
  const [userData, setUserData] = useState<RegisterUserData>({
    email: '',
    username: '',
    password: '',
  });
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    email: false,
    password: false,
  });
  // Validate current form values on each render so the submit button reflects the latest form state.
  const validationResult = registerSchema.safeParse(userData);
  const isFormValid = validationResult.success;
  // Convert Zod errors into field-specific messages for the inputs.
  const liveFieldErrors = validationResult.success
    ? {}
    : z.flattenError(validationResult.error).fieldErrors;
  // Only show field errors after a user has left that field, so validation does not feel too aggressive.
  const usernameError = touchedFields.username
    ? liveFieldErrors.username?.[0]
    : undefined;
  const emailError = touchedFields.email
    ? liveFieldErrors.email?.[0]
    : undefined;
  const passwordError = touchedFields.password
    ? liveFieldErrors.password?.[0]
    : undefined;
  const passwordMaxLengthError =
    passwordError === 'Password must be 32 characters or fewer'
      ? passwordError
      : undefined;

  const {
    mutate: registerUserMutation,
    error,
    isPending,
    isSuccess,
    isError,
  } = useRegisterUser();

  // Password checklist uses the same rules as the schema, but gives live visual feedback.
  const passwordRules = {
    minLength: userData.password.length >= 8,
    uppercase: /[A-Z]/.test(userData.password),
    lowercase: /[a-z]/.test(userData.password),
    number: /[0-9]/.test(userData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(userData.password),
  };

  const hasPasswordText = userData.password.length > 0;

  function PasswordRule({
    isValid,
    children,
  }: {
    isValid: boolean;
    children: React.ReactNode;
  }) {
    const tone = !hasPasswordText
      ? 'text-app-muted'
      : isValid
        ? 'text-emerald-400'
        : 'text-red-400';

    return (
      <li className={`flex items-center gap-2 transition ${tone}`}>
        <span>{hasPasswordText && isValid ? '✓' : '•'}</span>
        <span>{children}</span>
      </li>
    );
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Re-validate on submit as a final guard before calling the API.
    const result = registerSchema.safeParse(userData);

    if (!result.success) {
      setTouchedFields({
        username: true,
        email: true,
        password: true,
      });

      return;
    }

    registerUserMutation(result.data);
  }

  return (
    <main className='relative min-h-screen overflow-hidden bg-app-bg px-6 py-8 text-app-text'>
      <div className='pointer-events-none absolute left-1/2 top-[-160px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl' />
      <div className='pointer-events-none absolute bottom-[-160px] right-[-120px] h-[360px] w-[360px] rounded-full bg-teal-500/10 blur-3xl' />

      <AuthNavbar />

      <section className='relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center py-12'>
        {isSuccess ? (
          <div className='w-full max-w-md rounded-3xl border border-emerald-500/20 bg-app-surface/70 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur'>
            <div className='text-center'>
              <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30'>
                <span className='text-2xl text-emerald-400'>✓</span>
              </div>

              <p className='mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400'>
                Account created
              </p>

              <h1 className='mt-4 text-3xl font-bold tracking-tight text-app-text'>
                Welcome to SourceChat
              </h1>

              <p className='mt-3 text-sm leading-6 text-app-muted'>
                Your account has been created successfully. You can now log in
                and start uploading your documents.
              </p>

              <Link
                to='/login'
                className='mt-8 inline-flex w-full items-center justify-center rounded-xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-primary-hover'
              >
                Go to login
              </Link>
            </div>
          </div>
        ) : (
          <div className='w-full max-w-md rounded-3xl border border-app-border bg-app-surface/70 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur'>
            <div className='text-center'>
              <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400'>
                Create account
              </p>

              <h1 className='mt-4 text-3xl font-bold tracking-tight text-app-text'>
                Start using SourceChat
              </h1>

              <p className='mt-3 text-sm leading-6 text-app-muted'>
                Create an account to upload documents and ask questions grounded
                in your own sources.
              </p>
            </div>

            <form className='mt-8 space-y-5' onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor='username'
                  className='mb-2 block text-sm font-medium text-app-text'
                >
                  Username
                </label>
                <input
                  value={userData.username}
                  onChange={(e) => {
                    setUserData({ ...userData, username: e.target.value });
                  }}
                  onBlur={() => {
                    setTouchedFields((prev) => ({ ...prev, username: true }));
                  }}
                  id='username'
                  name='username'
                  type='text'
                  autoComplete='username'
                  placeholder='elguja'
                  required
                  minLength={3}
                  maxLength={20}
                  aria-invalid={Boolean(usernameError)}
                  aria-describedby={
                    usernameError ? 'username-error' : undefined
                  }
                  className={`w-full rounded-xl border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:ring-4 ${
                    usernameError
                      ? 'border-red-400/70 focus:border-red-400 focus:ring-red-500/10'
                      : 'border-app-border focus:border-emerald-500/70 focus:ring-emerald-500/10'
                  }`}
                />
                {usernameError && (
                  <p id='username-error' className='mt-2 text-sm text-red-400'>
                    {usernameError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='mb-2 block text-sm font-medium text-app-text'
                >
                  Email
                </label>
                <input
                  value={userData.email}
                  onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                  }}
                  onBlur={() => {
                    setTouchedFields((prev) => ({ ...prev, email: true }));
                  }}
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  placeholder='you@example.com'
                  required
                  maxLength={254}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  className={`w-full rounded-xl border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:ring-4 ${
                    emailError
                      ? 'border-red-400/70 focus:border-red-400 focus:ring-red-500/10'
                      : 'border-app-border focus:border-emerald-500/70 focus:ring-emerald-500/10'
                  }`}
                />
                {emailError && (
                  <p id='email-error' className='mt-2 text-sm text-red-400'>
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='mb-2 block text-sm font-medium text-app-text'
                >
                  Password
                </label>
                <input
                  value={userData.password}
                  onChange={(e) => {
                    setUserData({ ...userData, password: e.target.value });
                  }}
                  onBlur={() => {
                    setTouchedFields((prev) => ({ ...prev, password: true }));
                  }}
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  placeholder='Create a password'
                  required
                  minLength={8}
                  maxLength={32}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby='password-rules'
                  className={`w-full rounded-xl border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:ring-4 ${
                    passwordError
                      ? 'border-red-400/70 focus:border-red-400 focus:ring-red-500/10'
                      : 'border-app-border focus:border-emerald-500/70 focus:ring-emerald-500/10'
                  }`}
                />
                <ul id='password-rules' className='mt-3 space-y-1 text-xs'>
                  <PasswordRule isValid={passwordRules.minLength}>
                    At least 8 characters
                  </PasswordRule>

                  <PasswordRule isValid={passwordRules.uppercase}>
                    One uppercase letter
                  </PasswordRule>

                  <PasswordRule isValid={passwordRules.lowercase}>
                    One lowercase letter
                  </PasswordRule>

                  <PasswordRule isValid={passwordRules.number}>
                    One number
                  </PasswordRule>

                  <PasswordRule isValid={passwordRules.special}>
                    One special character
                  </PasswordRule>
                </ul>
                {passwordMaxLengthError && (
                  <p className='mt-2 text-sm text-red-400'>
                    {passwordMaxLengthError}
                  </p>
                )}
              </div>

              {isError && (
                <div className='rounded-xl bg-red-400/10 p-4 text-center text-sm text-red-500'>
                  {error ? error.message : 'Unknown error'}
                </div>
              )}

              <button
                type='submit'
                disabled={isPending || !isFormValid}
                className='w-full rounded-xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition cursor-pointer hover:bg-app-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-app-primary'
              >
                {isPending ? 'Creating account...' : 'Create account'}
              </button>
              {!isFormValid && (
                <p className='text-center text-xs text-app-muted'>
                  Complete all fields and password requirements to continue.
                </p>
              )}
            </form>

            <p className='mt-6 text-center text-sm text-app-muted'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='font-medium text-emerald-400 transition hover:text-emerald-300'
              >
                Log in
              </Link>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
