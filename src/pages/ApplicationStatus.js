import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import apiService from '../apiService';

// A dedicated component to show the application's submitted status.
const ApplicationStatus = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await apiService.auth.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 text-center">
        <FontAwesomeIcon icon={faCheckCircle} className="text-6xl mb-4 text-green-400" />
        <h1 className="text-2xl font-bold text-white mb-2">Application Submitted Successfully!</h1>
        <p className="text-[#8b949e] mb-6 max-w-md mx-auto">
          Dear {user?.name || 'Visitor'}, your Visitor Registration (Form C) has been successfully submitted. 
          No further action is required at this time.
        </p>
        
        {/* User Details Summary */}
        {user && (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 mb-6 text-left max-w-md mx-auto">
            <h3 className="text-sm font-semibold text-white mb-2">Application Details:</h3>
            <div className="space-y-1 text-sm">
              <div><span className="text-[#8b949e]">Name:</span> <span className="text-white">{user.name}</span></div>
              <div><span className="text-[#8b949e]">Nationality:</span> <span className="text-white">{user.nationality}</span></div>
              <div><span className="text-[#8b949e]">Passport:</span> <span className="text-white">{user.passport_number}</span></div>
            </div>
          </div>
        )}
        
        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 mb-6 inline-block">
          <span className="text-sm text-[#8b949e]">Current Status: </span>
          <span className="font-semibold text-green-400">Submitted</span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
