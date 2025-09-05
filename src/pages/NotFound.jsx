import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({ isDarkMode }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex-1 flex items-center justify-center ${bgColor}`}>
      <div className={`${cardBg} p-8 rounded-lg shadow-lg text-center max-w-md mx-4`}>
        <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
        <h1 className={`text-2xl font-bold mb-4 ${textColor}`}>Page Not Found</h1>
        <p className={`mb-6 ${textColor}`}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className={`inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ${textColor}`}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
