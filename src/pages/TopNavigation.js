import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTimes, faTachometerAlt, faCompass,
  faQuestionCircle, faFileAlt, faUser, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

// Get API base URL from environment or use default

const TopNavigation = ({ userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileBox, setShowProfileBox] = useState(false);
  const profileRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    console.log('Logout button clicked!');
    
    // Remove access token from localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    console.log('Tokens removed from localStorage');
    
    // Clear API headers
    if (apiService && apiService.utils) {
      apiService.utils.removeAuthToken();
      console.log('API headers cleared');
    }
    
    // Navigate to login page
    console.log('Navigating to login page...');
    navigate('/login');
  };

  // Close profile box on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileBox(false);
      }
    }
    if (showProfileBox) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileBox]);

  const navLinks = [
    { to: "/dashboard", icon: faTachometerAlt, text: "Dashboard" },
    { to: "/explore", icon: faCompass, text: "Explore" },
    { to: "/help", icon: faQuestionCircle, text: "Help & Support" },
    { to: "/form-c", icon: faFileAlt, text: "Form C Application" },
  ];

  return (
    <nav className="bg-[#161b22] border-b border-[#30363d] px-4 sm:px-8 py-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between w-full">
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-200 text-2xl">
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* Centered Nav Links */}
        <div className="hidden md:flex items-center space-x-6 justify-center flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-300 ${
                isActive(link.to) ? 'bg-blue-600 text-white font-medium' : 'text-gray-200 hover:bg-[#21262d]'
              }`}
            >
              <FontAwesomeIcon icon={link.icon} />
              <span>{link.text}</span>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-[#161b22] rounded-lg shadow-lg">
          <div className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-300 ${
                  isActive(link.to) ? 'bg-blue-600 text-white font-medium' : 'text-gray-200 hover:bg-[#21262d]'
                }`}
              >
                <FontAwesomeIcon icon={link.icon} className="w-5" />
                <span>{link.text}</span>
              </Link>
            ))}
            <div className="border-t border-[#30363d] pt-4 mt-2 flex flex-col space-y-2">
              <button
                onClick={() => setShowProfileBox((v) => !v)}
                className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-200 hover:bg-[#21262d] focus:outline-none"
              >
                <FontAwesomeIcon icon={faUser} className="w-5" />
                <span>Profile</span>
              </button>
              {showProfileBox && (
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg px-6 py-5 text-center mt-12">
                  <div className="text-[#8b949e] text-xs mb-1">Logged in as</div>
                  <div className="text-lg font-semibold text-white mb-2">{userName}</div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 mt-2"
                  >
                    Logout
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-200 hover:bg-[#21262d]"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavigation;
