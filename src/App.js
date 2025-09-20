import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import HelpSupport from './pages/HelpSupport';
import FormCApplication from './pages/FormCApplication';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import { apiUtils } from './apiService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Use the centralized auth utility to check authentication
  const isAuthenticated = apiUtils.isAuthenticated();
  
  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0d1117]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes - Only accessible after login */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute>
              <HelpSupport />
            </ProtectedRoute>
          } />
          <Route path="/form-c" element={
            <ProtectedRoute>
              <FormCApplication />
            </ProtectedRoute>
          } />
        
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
