import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../apiService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showResetForm, setShowResetForm] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.auth.login({
        email: formData.email,
        password: formData.password
      });
      
      // Handle the access_token from the API response
      if (response.access_token) {
        apiService.utils.setAuthToken(response.access_token);
        localStorage.setItem('userToken', response.access_token);
        localStorage.setItem('isLoggedIn', 'true');
      } else if (response.token) {
        // Fallback if API returns 'token' instead
        apiService.utils.setAuthToken(response.token);
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setForgotPasswordStatus('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setForgotPasswordStatus('');

    try {
      await apiService.auth.forgotPassword(forgotPasswordEmail);
      setForgotPasswordStatus('success');
      setShowResetForm(true);
      setResetPasswordData(prev => ({ ...prev, email: forgotPasswordEmail }));
    } catch (err) {
      setForgotPasswordStatus(`Failed: ${err.message || 'An error occurred. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const { email, otp } = resetPasswordData;

    if (!email || !otp) {
      setError('Please enter the OTP sent to your email.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the API to verify the OTP
      await apiService.auth.verifyResetOTP(email, otp);
      setOtpVerified(true);
      setError('');
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    const { email, otp, newPassword, confirmPassword } = resetPasswordData;

    if (!email || !otp || !newPassword) {
      setError('Please fill all required fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await apiService.auth.resetPassword(email, otp, newPassword);
      setForgotPasswordStatus('Password reset successful. You can now login with your new password.');
      setShowForgotPassword(false);
      setShowResetForm(false);
      setOtpVerified(false);
    } catch (err) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="background.png" 
          alt="Police Station Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      <div className="max-w-md w-full z-10 relative">
        {/* Police Badge and Title */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-30 h-30 mx-auto flex items-center justify-center">
                <img src="logo police.png" alt="Police Badge" className="w-24 h-24" />
            </div>
          </div>
          {/* Added responsive font size */}
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Foreign Nationals Monitoring & Grievance System
          </h1>
          <p className="text-[#8b949e] text-sm">Please sign in to continue</p>
        </div>

        {!showForgotPassword ? (
          /* Login Form */
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username/Email */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b949e] text-sm">
                    👤
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="eg: dharmavaram.123"
                    className="w-full pl-10 pr-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b949e] text-sm">
                    🔒
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-[#8b949e] text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Forgot Password Form */
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sm:p-8">
            {!showResetForm ? (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <h2 className="text-lg font-medium text-white mb-4">Reset Password</h2>
                <p className="text-[#8b949e] text-sm mb-4">Enter your email address and we'll send you an OTP to reset your password.</p>
                
                {/* Email Input */}
                <div>
                  <label className="block text-[#8b949e] text-sm mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b949e] text-sm">
                      📧
                    </span>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                      required
                    />
                  </div>
                </div>

                {/* Status Message */}
                {forgotPasswordStatus && forgotPasswordStatus !== 'success' && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                    <p className="text-red-400 text-sm">{forgotPasswordStatus}</p>
                  </div>
                )}

                {forgotPasswordStatus === 'success' && (
                  <div className="bg-green-500/10 border border-green-500/50 rounded-md p-3">
                    <p className="text-green-400 text-sm">OTP sent to your email address.</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
              ) : (
                /* OTP Verification or Reset Password Form */
                <>
                  {!otpVerified ? (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      <h2 className="text-lg font-medium text-white mb-4">Verify OTP</h2>
                      <p className="text-[#8b949e] text-sm mb-4">Enter the OTP sent to your email address.</p>
                      
                      {/* OTP Input */}
                      <div>
                        <label className="block text-[#8b949e] text-sm mb-2">OTP Code</label>
                        <input
                          type="text"
                          name="otp"
                          value={resetPasswordData.otp}
                          onChange={handleResetPasswordChange}
                          placeholder="Enter OTP"
                          className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                          required
                        />
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                          <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Verifying OTP...
                          </>
                        ) : (
                          'Verify OTP'
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                      <h2 className="text-lg font-medium text-white mb-4">Reset Your Password</h2>
                      <p className="text-[#8b949e] text-sm mb-4">Enter your new password.</p>
                      
                      {/* New Password */}
                      <div>
                        <label className="block text-[#8b949e] text-sm mb-2">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={resetPasswordData.newPassword}
                          onChange={handleResetPasswordChange}
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                          required
                        />
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-[#8b949e] text-sm mb-2">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={resetPasswordData.confirmPassword}
                          onChange={handleResetPasswordChange}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                          required
                        />
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                          <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Resetting Password...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </button>
                    </form>
                  )}

                  {/* Back to Login */}
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setShowResetForm(false);
                        setOtpVerified(false);
                      }}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm"
                    >
                      Back to Login
                    </button>
                  </div>
                 </>
              )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[#8b949e] text-xs">
            © 2025 Sri Satya Sai District Police. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
