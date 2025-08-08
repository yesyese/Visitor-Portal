import React, { useState, useEffect } from 'react';
import TopNavigation from './TopNavigation';
import apiService from '../apiService';
import Chatbot from '../components/Chatbot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, faPhoneAlt, faAmbulance, faFireExtinguisher, faInfoCircle, 
    faExclamationTriangle, faChevronDown, faFemale 
} from '@fortawesome/free-solid-svg-icons';

// AccordionItem component for the FAQ section
const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-[#30363d]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-4 text-left group"
            >
                <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors text-base sm:text-lg">
                    {title}
                </h3>
                <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-[#8b949e] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            {isOpen && (
                <div className="pb-4 pr-4 text-[#8b949e] text-sm sm:text-base">
                    {children}
                </div>
            )}
        </div>
    );
};


const HelpSupport = () => {
    const [complaint, setComplaint] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Check authentication status on component mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoadingAuth(true);
            const token = localStorage.getItem('userToken');
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            
            console.log('Auth check - Token:', token ? 'Present' : 'Not found');
            console.log('Auth check - isLoggedIn:', isLoggedIn);
            
            if (token && isLoggedIn === 'true') {
                try {
                    // Fetch current user data from API
                    const userData = await apiService.auth.getCurrentUser();
                    setUserInfo(userData);
                    setIsAuthenticated(true);
                    console.log('User authenticated:', userData.name);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setIsAuthenticated(false);
                    setUserInfo(null);
                }
            } else {
                setIsAuthenticated(false);
                setUserInfo(null);
                console.log('User not authenticated');
            }
            setIsLoadingAuth(false);
        };
        
        checkAuthStatus();
        
        // Also listen for storage changes (when user logs in from another tab)
        const handleStorageChange = () => {
            checkAuthStatus();
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        // Check authentication first
        if (!isAuthenticated) {
            setSubmitMessage({ text: 'Please login to submit a complaint.', type: 'error' });
            return;
        }
        if (!complaint.trim()) {
            setSubmitMessage({ text: 'Please enter your complaint details.', type: 'error' });
            return;
        }
        setIsSubmitting(true);
        setSubmitMessage(''); // Clear previous messages
        try {
            await apiService.support.submitComplaint({ Subject: complaint });
            setSubmitMessage({ text: 'Complaint submitted successfully! We will contact you soon.', type: 'success' });
            setComplaint('');
        } catch (error) {
            console.error('Error submitting complaint:', error);
            // Handle different types of errors more specifically
            if (error.message.includes('authentication token')) {
                setSubmitMessage({ text: 'Please login again to submit a complaint.', type: 'error' });
                setIsAuthenticated(false); // Update auth state
            } else if (error.message.includes('Network')) {
                setSubmitMessage({ text: 'Network error. Please check your connection and try again.', type: 'error' });
            } else {
                setSubmitMessage({ text: `Failed to submit complaint: ${error.message}`, type: 'error' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const emergencyContacts = [
        { title: 'Police', number: '100', icon: faShieldAlt, color: 'text-red-400' },
        { title: 'District Control Room', number: '08555-2XXXXX', icon: faPhoneAlt, color: 'text-red-400' },
        { title: 'Women Helpline', number: '1091', icon: faFemale, color: 'text-red-400' },
        { title: 'Ambulance', number: '108', icon: faAmbulance, color: 'text-red-400' },
        { title: 'Tourist Helpline', number: '1363', icon: faInfoCircle, color: 'text-red-400' },
        { title: 'Fire Services', number: '101', icon: faFireExtinguisher, color: 'text-red-400' }
    ];

    return (
        <div className="min-h-screen bg-[#0d1117]">
            <TopNavigation userName={userInfo?.name || "User"} />
            
                        <div className="container mx-auto px-4 sm:px-6 py-8">
                                <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">Help & Support</h1>

                                {/* Profile Box */}
                                {isAuthenticated && userInfo && (
                                    <div className="flex justify-center mb-10">
                                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-8 py-6 shadow-md text-center w-full max-w-xs">
                                            <div className="text-[#8b949e] text-sm mb-2">Logged in as</div>
                                            <div className="text-xl font-semibold text-white">{userInfo.name}</div>
                                        </div>
                                    </div>
                                )}
                
                                {/* Emergency Contacts Section */}
                <div className="mb-12">
                    <div className="flex items-center mb-6">
                        <div className="w-1 bg-red-500 h-12 sm:h-16 mr-4 sm:mr-6 rounded"></div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-red-400 flex items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
                                Emergency Contacts
                            </h2>
                            <p className="text-[#8b949e] text-sm sm:text-base">For immediate assistance, please use the numbers below.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {emergencyContacts.map((contact, index) => (
                            <div key={index} className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 text-center hover:border-red-500/50 transition-colors cursor-pointer">
                                <FontAwesomeIcon icon={contact.icon} className={`text-4xl mb-4 ${contact.color}`} />
                                <h3 className="text-lg font-medium text-[#c9d1d9] mb-1">{contact.title}</h3>
                                <a href={`tel:${contact.number}`} className="text-2xl font-bold text-white hover:text-red-400 transition-colors">
                                    {contact.number}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Help Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Contact Support Section */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Contact Support</h2>
                        <p className="text-[#8b949e] text-sm mb-6">For general inquiries, please reach out to us.</p>
                        <div className="space-y-3">
                            <div>
                                <span className="text-white font-medium">Phone: </span>
                                <a href="tel:+91-000-000-0000" className="text-[#8b949e] hover:text-blue-400">+91-XXX-XXXX-XXX (Placeholder)</a>
                            </div>
                            <div>
                                <span className="text-white font-medium">Email: </span>
                                <a href="mailto:support.ssd@gov.in" className="text-[#8b949e] hover:text-blue-400">support.ssd@gov.in (Placeholder)</a>
                            </div>
                        </div>
                    </div>

                    {/* Submit a Complaint Section */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Submit a Complaint</h2>
                        
                        {isLoadingAuth ? (
                            <div className="text-center py-8">
                                <p className="text-[#8b949e]">Checking authentication status...</p>
                            </div>
                        ) : !isAuthenticated ? (
                            <div className="text-center py-8">
                                <p className="text-[#8b949e] mb-4">Please login to submit a complaint</p>
                                <button 
                                    onClick={() => window.location.href = '/login'}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                                >
                                    Login
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleComplaintSubmit} className="space-y-4">
                                <div>
                                    <textarea
                                        value={complaint}
                                        onChange={(e) => setComplaint(e.target.value)}
                                        placeholder="Please describe your issue in detail..."
                                        className="w-full h-24 px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-[#8b949e] resize-none focus:outline-none focus:border-[#58a6ff]"
                                        rows={4}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {submitMessage && (
                                    <div className={`p-3 rounded-md text-sm ${
                                        submitMessage.type === 'success'
                                        ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                                        : 'bg-red-600/20 text-red-400 border border-red-600/30'
                                    }`}>
                                        {submitMessage.text}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* === UPDATED: Frequently Asked Questions Section === */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                        <AccordionItem title="How do I raise a complaint?">
                            <p>To raise a complaint, navigate to the "Grievance" section on your user page. You will find a form where you can detail your issue. Please provide your full name, contact information, and a clear description of the problem. Upon submission, a unique reference number will be generated for you to track the progress of your complaint.</p>
                        </AccordionItem>
                        <AccordionItem title="What is Form C, and how can I apply for it?">
                            <p>Form C is a mandatory document for foreign nationals. To apply, go to the "Apply for Form C" section. You'll need to fill out a digital application with details about your stay, passport, and visa. The form will be automatically submitted to the Foreigners Registration Office (FRO) for approval.</p>
                        </AccordionItem>
                        <AccordionItem title="Where can I find information on local tourist places and emergency contacts?">
                            <p>You can find details about prominent tourist places in the "Explore" section of the website. For your safety, the "Emergency Contacts" section on this page provides a list of essential phone numbers, including local police, fire services, and medical assistance.</p>
                        </AccordionItem>
                         <AccordionItem title="What is the process for renewing my visa or extending my stay?">
                            <p>Visa renewal and extension are handled by the Foreigners Regional Registration Office (FRRO). While our portal does not process these applications, we provide necessary contact information and links to official government portals under the "Emergency Contacts" section. We recommend initiating this process well in advance of your visa's expiration date.</p>
                        </AccordionItem>
                         <AccordionItem title="How do I access emergency numbers and support?">
                            <p>A list of all emergency contact numbers is available on this page under the "Emergency Contacts" section. These numbers include local police, hospitals, and fire services. We also provide a helpline number for immediate, 24/7 assistance.</p>
                        </AccordionItem>
                    </div>
                </div>
            </div>
            <Chatbot />
        </div>
    );
};

export default HelpSupport;
