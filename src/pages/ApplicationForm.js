import React, { useState, useEffect } from 'react';
import apiService from '../apiService';

// Simple form component for new Form C applications
const ApplicationForm = ({ onFormSubmit }) => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    FullName: '',
    Nationality: '',
    Gender: 'Male',
    PassportNumber: '',
    PassportValidity: '',
    VisaNumber: '',
    VisaExpiry: '',
    VisaType: 'Tourist',
    DateOfVisit: '',
    Occupation: '',
    Employer: '',
    IndianAddress: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await apiService.auth.getCurrentUser();
        setUser(userData);
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          FullName: userData.name || '',
          Nationality: userData.nationality || '',
          PassportNumber: userData.passport_number || '',
          PassportValidity: userData.passport_validity || ''
        }));
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await apiService.formC.submitApplication(formData);
      onFormSubmit(true); // Notify the parent component that submission was successful
    } catch (err) {
      setError(err.message || 'Form submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Visitor Registration (Form C)</h1>
          <p className="text-[#8b949e] text-sm">
            Please fill out the form below to register your visit to Satya Sai District.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#c9d1d9] border-b border-[#30363d] pb-2 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Full Name</label>
                <input type="text" name="FullName" value={formData.FullName} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm" required />
              </div>
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Nationality</label>
                <input type="text" name="Nationality" value={formData.Nationality} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm" required />
              </div>
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Gender</label>
                <select name="Gender" value={formData.Gender} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Travel Documents Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#c9d1d9] border-b border-[#30363d] pb-2 mb-4">Travel Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Passport Number</label>
                <input type="text" name="PassportNumber" value={formData.PassportNumber} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm" required />
              </div>
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Passport Validity</label>
                <input type="date" name="PassportValidity" value={formData.PassportValidity} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm" required />
              </div>
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Visa Number</label>
                <input type="text" name="VisaNumber" value={formData.VisaNumber} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm" required />
              </div>
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Visa Expiry</label>
                <input type="date" name="VisaExpiry" value={formData.VisaExpiry} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm" required />
              </div>
            </div>
          </div>
          
           {/* Visit Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#c9d1d9] border-b border-[#30363d] pb-2 mb-4">Visit Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Date of Visit</label>
                <input type="date" name="DateOfVisit" value={formData.DateOfVisit} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm" required />
              </div>
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Visa Type</label>
                <select name="VisaType" value={formData.VisaType} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm">
                  <option>Tourist</option>
                  <option>Business</option>
                  <option>Student</option>
                  <option>Medical</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Occupation</label>
                <input type="text" name="Occupation" value={formData.Occupation} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm" />
              </div>
              <div>
                <label className="block text-[#8b949e] text-sm mb-1">Employer</label>
                <input type="text" name="Employer" value={formData.Employer} onChange={handleChange} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#8b949e] text-sm mb-1">Address in India</label>
                <textarea name="IndianAddress" value={formData.IndianAddress} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-md text-white text-sm resize-none" required />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
