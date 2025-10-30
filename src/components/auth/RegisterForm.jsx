'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAuth } from '@/hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRegistration,
} from '@/lib/validation/authValidation';

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ strength: 'weak', requirements: {} });

  const validateField = (field, value) => {
    if (field === 'email') {
      const validation = validateEmail(value);
      return validation.error;
    }
    if (field === 'password') {
      const validation = validatePassword(value);
      setPasswordStrength({ strength: validation.strength, requirements: validation.requirements });
      return validation.error;
    }
    if (field === 'confirmPassword') {
      const validation = validatePasswordMatch(password, value);
      return validation.error;
    }
    return null;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let fieldValue = field === 'email' ? email : field === 'password' ? password : confirmPassword;
    const fieldError = validateField(field, fieldValue);
    setFieldErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') {
      setPassword(value);
      if (touched.password) {
        const validation = validatePassword(value);
        setPasswordStrength({ strength: validation.strength, requirements: validation.requirements });
      }
    }
    if (field === 'confirmPassword') setConfirmPassword(value);

    if (touched[field]) {
      const fieldError = validateField(field, value);
      setFieldErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validation = validateRegistration(email, password, confirmPassword);
    if (!validation.valid) {
      setFieldErrors({ [validation.field]: validation.error });
      setTouched({ email: true, password: true, confirmPassword: true });
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    !fieldErrors.email &&
    !fieldErrors.password &&
    !fieldErrors.confirmPassword &&
    email &&
    password &&
    confirmPassword &&
    passwordStrength.strength === 'strong';

  const getStrengthColor = () => {
    if (passwordStrength.strength === 'weak') return 'bg-red-500';
    if (passwordStrength.strength === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength.strength === 'weak') return 'Weak';
    if (passwordStrength.strength === 'medium') return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Create Account
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg flex gap-3">
            <AiOutlineCloseCircle className="text-red-500 dark:text-red-400 text-lg shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.email
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400'
                    : touched.email && !fieldErrors.email
                      ? 'border-green-300 dark:border-green-600 focus:ring-green-500 dark:focus:ring-green-400'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="you@example.com"
              />
              {touched.email && (
                <div className="absolute right-3 top-2.5">
                  {fieldErrors.email ? (
                    <AiOutlineCloseCircle className="text-red-500 dark:text-red-400 text-xl" />
                  ) : (
                    <AiOutlineCheckCircle className="text-green-500 dark:text-green-400 text-xl" />
                  )}
                </div>
              )}
            </div>
            {fieldErrors.email && touched.email && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.password
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400'
                    : touched.password && !fieldErrors.password
                      ? 'border-green-300 dark:border-green-600 focus:ring-green-500 dark:focus:ring-green-400'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="••••••••"
              />
              {touched.password && (
                <div className="absolute right-3 top-2.5">
                  {fieldErrors.password ? (
                    <AiOutlineCloseCircle className="text-red-500 dark:text-red-400 text-xl" />
                  ) : (
                    <AiOutlineCheckCircle className="text-green-500 dark:text-green-400 text-xl" />
                  )}
                </div>
              )}
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Strength:</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.strength === 'weak'
                      ? 'text-red-600 dark:text-red-400'
                      : passwordStrength.strength === 'medium'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-green-600 dark:text-green-400'
                  }`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getStrengthColor()}`}
                    style={{
                      width: `${
                        passwordStrength.strength === 'weak'
                          ? '33%'
                          : passwordStrength.strength === 'medium'
                            ? '66%'
                            : '100%'
                      }`,
                    }}
                  />
                </div>
              </div>
            )}

            {fieldErrors.password && touched.password && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.confirmPassword
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400'
                    : touched.confirmPassword && !fieldErrors.confirmPassword
                      ? 'border-green-300 dark:border-green-600 focus:ring-green-500 dark:focus:ring-green-400'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="••••••••"
              />
              {touched.confirmPassword && (
                <div className="absolute right-3 top-2.5">
                  {fieldErrors.confirmPassword ? (
                    <AiOutlineCloseCircle className="text-red-500 dark:text-red-400 text-xl" />
                  ) : (
                    <AiOutlineCheckCircle className="text-green-500 dark:text-green-400 text-xl" />
                  )}
                </div>
              )}
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}