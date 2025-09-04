import React from 'react';
import { API_ENDPOINTS } from '../appConstants';

const RegisteredCreators = ({ creators, apiStatus, onSelectCreator, onRegisterClick, onRefresh, isDarkMode, toggleTheme }) => {
  const cardBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const subtextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const accentColor = isDarkMode ? 'bg-gray-600' : 'bg-gray-300';
  const accentTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';

  return (
    <div className={`flex flex-col items-center p-8 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="w-full flex justify-end items-center mb-4">
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="w-full flex justify-between items-center mb-8 max-w-lg">
        <h1 className={`text-4xl font-bold ${textColor}`}>Creators</h1>
        <div className="flex space-x-4">
          <button
            onClick={onRegisterClick}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          >
            Register New Creator
          </button>
          <button
            onClick={onRefresh}
            className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
          >
            Refresh List
          </button>
        </div>
      </div>
      {apiStatus === 'Loading...' ? (
        <p className={`text-lg ${subtextColor}`}>Loading creators...</p>
      ) : apiStatus.startsWith('Error') ? (
        <p className="text-red-500 text-lg">{apiStatus}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {creators.length > 0 ? (
            creators.map(creator => (
              <div
                key={creator._id}
                onClick={() => onSelectCreator(creator)}
                className={`p-6 rounded-lg shadow-md transition-shadow duration-300 flex items-start space-x-4 cursor-pointer ${cardBg}`}
              >
                <div className="relative">
                  {creator.image_id ? (
                    <img
                      src={API_ENDPOINTS.image.get(creator.image_id)}
                      alt={`${creator.name}'s profile`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-lg flex items-center justify-center ${accentColor}`}>
                      <span className={`text-3xl ${subtextColor}`}>?</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className={`text-xl font-semibold ${textColor}`}>{creator.name}</h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCreator(creator);
                      }}
                      className={`p-2 rounded-full ${accentColor} ${accentTextColor} hover:bg-gray-400 transition-colors duration-300`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828L15.636 9l-2.122-2.122 2.122-2.122zM12 8l-6 6V16h2l6-6-2-2z" />
                      </svg>
                    </button>
                  </div>
                  <p className={`text-sm ${subtextColor} mb-1`}>{creator.description}</p>
                  <p className={`text-xs ${subtextColor}`}>Gender: {creator.gender}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={`col-span-full text-center text-lg ${subtextColor}`}>
              No creators found. Use the "Register New Creator" button to add one!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisteredCreators;
