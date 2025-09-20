import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../apiService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_no: '',
    passport_number: '',
    nationality: '',
    passport_validity: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPSuccess, setShowOTPSuccess] = useState(false);
  const [showOTPVerified, setShowOTPVerified] = useState(false);
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const sendOTPToEmail = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.mobile_no || !formData.nationality || !formData.passport_number || !formData.passport_validity) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      await apiService.auth.register(formData);
      setIsLoading(false);
      setShowOTPSuccess(true);
      setCurrentStep(2);
      setTimeout(() => {
        setShowOTPSuccess(false);
      }, 5000);
    } catch (err) {
      // === UPDATED ERROR HANDLING FOR 409 CONFLICT ===
      if (err.message && err.message.includes('409')) {
        setError(
          <span>
            You have already registered. Please{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:underline font-semibold"
            >
              login
            </button>
            .
          </span>
        );
      } else {
        setError(err.message || 'Failed to send OTP. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await apiService.auth.verifyOTP(formData.email, otp);
      setIsLoading(false);
      setShowOTPVerified(true);
      setCurrentStep(3);
      setTimeout(() => {
        setShowOTPVerified(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  const completeRegistration = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      setError('Please enter both password and confirmation.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await apiService.auth.setPassword(formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Password setup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="background.png" 
          alt="Police Station Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      
      {/* Main Content */}
      <div className="w-full max-w-md z-10">
        <div className="bg-[#161b22] bg-opacity-95 rounded-xl shadow-2xl p-6 sm:p-8">
      {/* Notifications */}
      {showOTPSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#161b22] border border-[#30363d] rounded-lg p-4 shadow-lg max-w-sm w-[90vw] mx-auto">
          {/* OTP Sent Notification Content */}
           <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">OTP Sent Successfully</h3>
                <p className="text-sm text-[#8b949e] mt-1">
                  OTP has sent to '{formData.email}' successfully.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowOTPSuccess(false)}
              className="flex-shrink-0 text-[#8b949e] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {showOTPVerified && (
        <div className="fixed top-4 right-4 z-50 bg-[#161b22] border border-[#30363d] rounded-lg p-4 shadow-lg max-w-sm w-[90vw]">
          {/* OTP Verified Notification Content */}
           <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">OTP Verified Successfully</h3>
                <p className="text-sm text-[#8b949e] mt-1">
                  'OTP has verified successfully'
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowOTPVerified(false)}
              className="flex-shrink-0 text-[#8b949e] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-md w-full">
        {/* Police Badge and Title */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-60 h-10 mx-auto flex items-center justify-center">
              <img src="logo police.png" alt="Police Badge" className="w-20 h-20" />
            </div>
          </div>
          {/* Responsive font size for the title */}
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Register for Satya Sai District Foreign Visitor Portal
          </h1>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8">
          {/* Reduced spacing on small screens */}
          <div className="flex space-x-2 sm:space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-[#30363d] text-[#8b949e]'
            }`}>
              1
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-[#30363d] text-[#8b949e]'
            }`}>
              2
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-[#30363d] text-[#8b949e]'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          {currentStep === 1 && (
            <form onSubmit={sendOTPToEmail} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Fullname</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b949e] text-sm">
                    
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="eg: test@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                  required
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                  required
                />
              </div>

              {/* Passport Number */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Passport Number</label>
                <input
                  type="text"
                  name="passport_number"
                  value={formData.passport_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                  required
                />
              </div>

              {/* Passport Validity */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Passport Validity</label>
                <input
                  type="date"
                  name="passport_validity"
                  value={formData.passport_validity}
                  onChange={handleChange}
                  placeholder="dd-mm-yyyy"
                  className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                  required
                />
              </div>

              {/* Send OTP Button */}
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
                  <>
                     Send OTP to Email
                  </>
                )}
              </button>
            </form>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter six digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25 text-center text-lg tracking-widest"
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOTP}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    ✓ Verify
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  onClick={() => sendOTPToEmail()}
                  disabled={isLoading}
                  className="text-[#8b949e] hover:text-white transition-colors duration-200 text-sm flex items-center justify-center w-full"
                >
                   Resend OTP
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <form onSubmit={completeRegistration} className="space-y-4">
              {/* Create Password */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Create Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 Characters"
                  className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                  required
                  minLength={6}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[#8b949e] text-sm mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Min 6 Characters"
                  className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/25"
                  required
                  minLength={6}
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  '🛡️ Register'
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full bg-[#30363d] hover:bg-[#424a53] text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                ← Back
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-[#8b949e] text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3 mt-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Link - Only show in step 1 */}
          {currentStep === 1 && (
            <div className="mt-6 text-center">
              <p className="text-[#8b949e] text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Login here
                </button>
              </p>
            </div>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
