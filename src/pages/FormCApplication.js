import React, { useState, useEffect } from 'react';
import TopNavigation from './TopNavigation';
import apiService from '../apiService';
import Chatbot from '../components/Chatbot';

// Import the two new components
import ApplicationStatus from './ApplicationStatus';
import ApplicationForm from './ApplicationForm';

// This is the main component that decides which view to show.
const FormCApplication = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('not_applied');

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Get current user data including form_c_status
        const userData = await apiService.auth.getCurrentUser();
        setUser(userData);
        setApplicationStatus(userData.form_c_status || 'not_applied');
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setApplicationStatus('not_applied');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Show a loading spinner while checking the status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <TopNavigation userName={user?.name || 'Visitor'} />
      
      {/* Conditionally render based on Form C status */}
      {/* Debug: Show current status */}
     
      
      {applicationStatus.toLowerCase() === 'submitted' ? (
        <ApplicationStatus />
      ) : (
        <ApplicationForm onFormSubmit={() => setApplicationStatus('submitted')} />
      )}
      
      <Chatbot />
    </div>
  );
};

export default FormCApplication;
