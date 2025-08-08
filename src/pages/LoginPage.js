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

  return (
    // Added responsive padding
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
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

        {/* Login Form */}
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
