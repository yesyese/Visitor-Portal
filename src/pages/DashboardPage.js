import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCompass, faQuestionCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Chatbot from '../components/Chatbot';
import apiService from '../apiService';

const DashboardPage = () => {
  // State to hold user data and loading status
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect to fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Assuming you have a method to get the current user's data
        const userData = await apiService.auth.getCurrentUser(); 
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Handle error, e.g., redirect to login if unauthorized
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Display a loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Component to render the Form C status or application link
  const FormCStatus = () => {
    const status = user?.form_c_status || 'pending';

    switch (status.toLowerCase()) {
      case 'pending':
        // Show Form C application button when status is Pending
        return (
          <Link 
            to="/form-c" 
            className="block bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 text-left transition-colors duration-200 no-underline"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Apply for Form C</h2>
                <p className="text-blue-200 mt-1 text-sm sm:text-base">Your application is pending. Click to continue or update.</p>
              </div>
              <FontAwesomeIcon icon={faFileAlt} className="hidden sm:block text-3xl sm:text-4xl text-blue-300" />
            </div>
          </Link>
        );
      case 'submitted':
        // Don't show anything when status is Submitted
        return null;
      default:
        // This shouldn't happen since you only have Pending and Submitted
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <TopNavigation userName={user?.name || 'Visitor'} />
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        {/* Left Section */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          {/* Welcome Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <h1 className="text-3xl sm:text-4xl mb-2 text-[#58a6ff]">Welcome, {user?.name || 'visitor'}!</h1>
            <p className="text-base text-[#8b949e]">Your central hub for information and services in Satya Sai District.</p>
          </div>

          {/* Dynamic Form C Section */}
          <FormCStatus />

          {/* Quick Actions Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-[#c9d1d9]">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/explore" className="flex flex-col items-center justify-center text-center bg-[#0d1117] border border-[#30363d] rounded-lg p-5 text-[#c9d1d9] no-underline font-medium transition-colors duration-200 hover:bg-[#1a1f26] hover:border-[#8b949e]">
                <FontAwesomeIcon icon={faCompass} className="text-3xl sm:text-4xl mb-3 text-[#58a6ff]" />
                Explore District
              </Link>
              <Link to="/help" className="flex flex-col items-center justify-center text-center bg-[#0d1117] border border-[#30363d] rounded-lg p-5 text-[#c9d1d9] no-underline font-medium transition-colors duration-200 hover:bg-[#1a1f26] hover:border-[#8b949e]">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-3xl sm:text-4xl mb-3 text-[#58a6ff]" />
                Get Help
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          {/* Upcoming Festivals Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-[#c9d1d9]">Upcoming Festivals</h2>
            <div className="divide-y divide-[#21262d]">
              <div className="flex items-center justify-between py-3">
                <div className="flex flex-col">
                  <span className="text-base font-medium text-[#c9d1d9]">Guru Purnima</span>
                  <span className="text-sm text-[#8b949e]">July</span>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="text-[#8b949e] text-xl" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex flex-col">
                  <span className="text-base font-medium text-[#c9d1d9]">Sri Sathya Sai's Birthday</span>
                  <span className="text-sm text-[#8b949e]">November 23rd</span>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="text-[#8b949e] text-xl" />
              </div>
              <div className="flex items-center justify-between py-3 border-b-0">
                <div className="flex flex-col">
                  <span className="text-base font-medium text-[#c9d1d9]">Dasara (Dussehra)</span>
                  <span className="text-sm text-[#8b949e]">September/October</span>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="text-[#8b949e] text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default DashboardPage;
