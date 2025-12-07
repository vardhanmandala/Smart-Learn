import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
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

const RegisterForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
    suggestions: []
  });

  // Validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Name must be 2-50 characters and contain only letters'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
    },
    confirmPassword: {
      required: true,
      match: 'password',
      message: 'Passwords do not match'
    }
  };

  // Calculate password strength
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, label: '', color: '', suggestions: [] });
    }
  }, [formData.password]);

  // Calculate password strength function
  const calculatePasswordStrength = (password) => {
    let score = 0;
    const suggestions = [];

    if (password.length >= 8) score++;
    else suggestions.push('At least 8 characters');

    if (password.length >= 12) score++;

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    else suggestions.push('Mix of uppercase and lowercase');

    if (/\d/.test(password)) score++;
    else suggestions.push('Include numbers');

    if (/[@$!%*?&]/.test(password)) score++;
    else suggestions.push('Include special characters');

    let label = '';
    let color = '';

    if (score <= 1) {
      label = 'Weak';
      color = '#ef4444';
    } else if (score === 2) {
      label = 'Fair';
      color = '#f59e0b';
    } else if (score === 3) {
      label = 'Good';
      color = '#3b82f6';
    } else if (score === 4) {
      label = 'Strong';
      color = '#10b981';
    } else {
      label = 'Very Strong';
      color = '#059669';
    }

    return { score, label, color, suggestions };
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

    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    if (rule.match && value !== formData[rule.match]) {
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setTouched({});
        setErrors({});

        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setApiError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          {/* Left side - Form */}
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Create Account</h1>
              <p className={styles.subtitle}>Join thousands of learners worldwide</p>
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
              {/* Name Field */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name
                  <span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrapper} ${hasError('name') ? styles.inputError : ''}`}>
                  <FaUser className={styles.inputIcon} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.input}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  {touched.name && !errors.name && formData.name && (
                    <FaCheckCircle className={styles.validIcon} />
                  )}
                </div>
                {hasError('name') && (
                  <p className={styles.errorMessage}>{errors.name}</p>
                )}
              </div>

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
                    placeholder="Create a strong password"
                    disabled={isLoading}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBar}>
                      <div 
                        className={styles.strengthFill}
                        style={{ 
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <p className={styles.strengthLabel} style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </p>
                    {passwordStrength.suggestions.length > 0 && (
                      <ul className={styles.suggestions}>
                        {passwordStrength.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                  <span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrapper} ${hasError('confirmPassword') ? styles.inputError : ''}`}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.input}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                    <FaCheckCircle className={styles.validIcon} />
                  )}
                </div>
                {hasError('confirmPassword') && (
                  <p className={styles.errorMessage}>{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className={styles.terms}>
                <p>
                  By registering, you agree to our{' '}
                  <a href="/terms" className={styles.link}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className={styles.link}>Privacy Policy</a>
                </p>
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
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

            {/* Login Link */}
            <div className={styles.footer}>
              <p>
                Already have an account?{' '}
                <a href="/login" className={styles.link}>Sign In</a>
              </p>
            </div>
          </div>

          {/* Right side - Info */}
          <div className={styles.infoSection}>
            <div className={styles.infoContent}>
              <h2>Start Your Learning Journey</h2>
              <ul className={styles.benefits}>
                <li>
                  <FaCheckCircle />
                  <span>Access thousands of video lessons</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Interactive quizzes and assessments</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Track your learning progress</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>AI-powered transcriptions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
