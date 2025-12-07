import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaGoogle,
  FaGithub
} from 'react-icons/fa';
import styles from './AuthForm.module.css';

const LoginForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Validation rules
  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 1,
      message: 'Password is required'
    }
  };

  // Validate single field
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (rule.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    return '';
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear API error when user starts typing
    if (apiError) setApiError('');

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token
        localStorage.setItem('token', data.token);
        
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        setSuccessMessage('Login successful! Redirecting...');

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setApiError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login (placeholder)
  const handleSocialLogin = (provider) => {
    console.log(`Social login with ${provider} - Implementation needed`);
    // Implement OAuth flow here
  };

  // Check if field has error
  const hasError = (field) => touched[field] && errors[field];

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          {/* Left side - Info */}
          <div className={styles.infoSection}>
            <div className={styles.infoContent}>
              <h2>Welcome Back!</h2>
              <p>Sign in to continue your learning journey and access your personalized dashboard.</p>
              <ul className={styles.benefits}>
                <li>
                  <FaCheckCircle />
                  <span>Resume your video lessons</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Track your quiz scores</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>View learning analytics</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Access saved videos</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right side - Form */}
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Sign In</h1>
              <p className={styles.subtitle}>Access your account</p>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className={styles.errorAlert}>
                <FaTimesCircle className={styles.alertIcon} />
                <span>{apiError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className={styles.successAlert}>
                <FaCheckCircle className={styles.alertIcon} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                  <span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrapper} ${hasError('email') ? styles.inputError : ''}`}>
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.input}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  {touched.email && !errors.email && formData.email && (
                    <FaCheckCircle className={styles.validIcon} />
                  )}
                </div>
                {hasError('email') && (
                  <p className={styles.errorMessage}>{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                  <span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrapper} ${hasError('password') ? styles.inputError : ''}`}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.input}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {hasError('password') && (
                  <p className={styles.errorMessage}>{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className={styles.link}>
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className={styles.spinner} />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className={styles.divider}>
              <span>Or continue with</span>
            </div>

            {/* Social Login Buttons */}
            <div className={styles.socialButtons}>
              <button
                type="button"
                className={styles.socialButton}
                onClick={() => handleSocialLogin('google')}
              >
                <FaGoogle />
                <span>Google</span>
              </button>
              <button
                type="button"
                className={styles.socialButton}
                onClick={() => handleSocialLogin('github')}
              >
                <FaGithub />
                <span>GitHub</span>
              </button>
            </div>

            {/* Register Link */}
            <div className={styles.footer}>
              <p>
                Don't have an account?{' '}
                <a href="/register" className={styles.link}>Create Account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
