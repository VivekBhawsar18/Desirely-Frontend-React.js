import React from 'react';

const Footer = ({ isDarkMode }) => {
  const footerBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const footerText = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const footerBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <footer className={`${footerBg} border-t ${footerBorder} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className={`text-sm ${footerText} mb-4 md:mb-0`}>
            © 2024 UpLiftMe Portal. All rights reserved.
          </div>

                     {/* Links */}
           <div className="flex space-x-6">
             <button 
               className={`text-sm ${footerText} hover:text-blue-600 transition-colors duration-300 bg-transparent border-none cursor-pointer`}
             >
               Privacy Policy
             </button>
             <button 
               className={`text-sm ${footerText} hover:text-blue-600 transition-colors duration-300 bg-transparent border-none cursor-pointer`}
             >
               Terms of Service
             </button>
             <button 
               className={`text-sm ${footerText} hover:text-blue-600 transition-colors duration-300 bg-transparent border-none cursor-pointer`}
             >
               Contact Us
             </button>
           </div>
        </div>

        {/* Additional Info */}
        <div className={`mt-4 text-xs ${footerText} text-center`}>
          Built with React.js and Tailwind CSS
        </div>
      </div>
    </footer>
  );
};

export default Footer;
