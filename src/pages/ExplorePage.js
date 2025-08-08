import React from 'react';
import TopNavigation from './TopNavigation';
import Chatbot from '../components/Chatbot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLandmark, faBus, faCalendarAlt, faLanguage, faOm, faUniversity, 
    faFilm, faTree, faArchway, faCarSide, faTaxi, faBusAlt 
} from '@fortawesome/free-solid-svg-icons';

const ExplorePage = () => {
    
  const places = [
    {
      icon: faOm,
      name: 'Prasanthi Nilayam',
      description: 'The main ashram of Sri Sathya Sai Baba, a place of spiritual pilgrimage.',
      imageUrl: 'https://www.prasanthinilayam.in/photogallery/Places%20to%20visit%20in%20Prasanthi%20Nilayam/DSC02748.jpg',
    },
    {
      icon: faUniversity,
      name: 'Chaitanya Jyoti Museum',
      description: 'A museum showcasing the life and teachings of Sri Sathya Sai Baba.',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/f7/a8/59/chaitanya-jyoti-museum.jpg?w=1400&h=-1&s=1',
    },
    {
      icon: faFilm,
      name: 'Sathya Sai Space Theatre',
      description: 'A planetarium that offers shows on astronomy and science.',
      imageUrl: 'https://home.saispace.in/images/Entrance.jpg?attredirects=0',
    },
    {
      icon: faTree,
      name: 'Vata Vriksha (Meditation Tree)',
      description: 'A serene banyan tree planted by Sri Sathya Sai Baba, ideal for meditation.',
      imageUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/19/2d/2d/b1/molti-anni-fa.jpg',
    },
    {
      icon: faUniversity,
      name: 'Sanathana Samskruti Museum',
      description: 'Also known as the Eternal Heritage Museum, displaying Indian culture and heritage.',
      imageUrl: 'https://www.sathyasai.org/sites/default/files/respimg/0/9/pages/ashram/sanathana-samskruthi-spiritual-museum.jpg',
    },
    {
      icon: faArchway,
      name: 'Gopuram (Gateway)',
      description: 'The ornate and iconic gateway to the Prasanthi Nilayam ashram.',
      imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/9a/e0/c3/gopuram-gateway.jpg?w=900&h=-1&s=1',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 font-sans">
      <TopNavigation />

      <div className="p-4 sm:p-6 md:p-8 flex-grow">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">Explore Satya Sai District</h1>

        {/* Places to Visit Section */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center text-[#c9d1d9]">
            <FontAwesomeIcon icon={faLandmark} className="text-blue-400 mr-3" />
            Places to Visit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place, index) => (
              <div key={index} className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-blue-500/20">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/161b22/c9d1d9?text=Image+Not+Found'; }}
                />
                <div className="p-4">
                    <div className="flex items-center mb-2">
                        <FontAwesomeIcon icon={place.icon} className="text-blue-400 text-xl mr-3" />
                        <h3 className="text-lg font-semibold text-white">{place.name}</h3>
                    </div>
                    <p className="text-[#8b949e] text-sm">{place.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transportation Guide Section */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center text-[#c9d1d9]">
            <FontAwesomeIcon icon={faBus} className="text-blue-400 mr-3" />
            Transportation Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <FontAwesomeIcon icon={faCarSide} className="text-blue-400 mr-3" />
                Auto Rickshaws
              </h3>
              <p className="text-[#8b949e] text-sm">Common for short distances. Always agree on a fare before starting your journey.</p>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <FontAwesomeIcon icon={faTaxi} className="text-blue-400 mr-3" />
                Taxis / Cabs
              </h3>
              <p className="text-[#8b949e] text-sm">Available for longer trips. Can be booked through local operators or ride-sharing apps.</p>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <FontAwesomeIcon icon={faBusAlt} className="text-blue-400 mr-3" />
                Buses
              </h3>
              <p className="text-[#8b949e] text-sm">The state-run bus service (APSRTC) connects the district to major nearby towns and cities.</p>
            </div>
          </div>
        </div>

        {/* Bottom Section with Festivals and Language Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* === UPDATED: Local Festivals Section === */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center text-[#c9d1d9]">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400 mr-3" />
              Local Festivals
            </h2>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Aradhana Mahotsavam (April)</h3>
                <p className="text-[#8b949e] text-sm">This day commemorates the passing of Sri Sathya Sai Baba. It is a time for solemn prayers, devotional offerings, and spiritual reflections on his life and teachings.</p>
              </div>
               <div className="border-t border-[#30363d]"></div>
              <div>
                <h3 className="text-lg font-semibold text-white">Guru Purnima (July)</h3>
                <p className="text-[#8b949e] text-sm">A significant event for devotees to express gratitude to their spiritual teacher, filled with devotional singing (bhajans) and special ceremonies.</p>
              </div>
               <div className="border-t border-[#30363d]"></div>
              <div>
                <h3 className="text-lg font-semibold text-white">Navaratri/Dasara (Sep/Oct)</h3>
                <p className="text-[#8b949e] text-sm">The nine-day festival of Navaratri is celebrated with spiritual and cultural programs, culminating on Vijaya Dasami, symbolizing the victory of good over evil.</p>
              </div>
               <div className="border-t border-[#30363d]"></div>
              <div>
                <h3 className="text-lg font-semibold text-white">Sri Sathya Sai Baba's Birthday (Nov 23rd)</h3>
                <p className="text-[#8b949e] text-sm">The most important festival of the year, marked by special prayers, cultural events, and a massive community feeding program.</p>
              </div>
            </div>
          </div>

          {/* Language & Etiquette Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center text-[#c9d1d9]">
              <FontAwesomeIcon icon={faLanguage} className="text-blue-400 mr-3" />
              Language & Etiquette
            </h2>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Phrases (Telugu)</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                    <span className="text-[#8b949e] font-medium">Hello</span>
                    <span className="text-white text-right">Namaskaram</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                    <span className="text-[#8b949e] font-medium">Thank you</span>
                    <span className="text-white text-right">Dhanyavadalu</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                    <span className="text-[#8b949e] font-medium">How much?</span>
                    <span className="text-white text-right">Enta?</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Local Customs</h3>
                <ul className="space-y-2 text-[#8b949e] text-sm list-disc list-inside">
                  <li>Dress modestly, especially when visiting sacred places.</li>
                  <li>Remove footwear before entering homes or temples.</li>
                  <li>Use your right hand for giving, receiving, and eating.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default ExplorePage;
