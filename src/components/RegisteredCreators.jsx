import React, { useState, useEffect } from 'react';

const RegisteredCreators = ({ onSelectCreator, onRegisterClick }) => {
  const [creators, setCreators] = useState([]);
  const [apiStatus, setApiStatus] = useState('');

  const fetchData = async () => {
    setApiStatus('Loading...');
    try {
      const response = await fetch('http://localhost:8000/api/creators');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setApiStatus('Success');
      setCreators(data);
    } catch (error) {
      setApiStatus(`Error: ${error.message}`);
      console.error('API Fetch Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Registered Creators</h1>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={onRegisterClick}
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
        >
          Register New Creator
        </button>
        <button
          onClick={fetchData}
          className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
        >
          Refresh List
        </button>
      </div>

      {apiStatus === 'Loading...' ? (
        <p className="text-gray-500 text-lg">Loading creators...</p>
      ) : apiStatus.startsWith('Error') ? (
        <p className="text-red-500 text-lg">{apiStatus}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {creators.length > 0 ? (
            creators.map(creator => (
              <div
                key={creator._id}
                onClick={() => onSelectCreator(creator)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-gray-800">{creator.name}</h2>
                <p className="text-gray-600 mt-2">{creator.description}</p>
                <p className="text-sm text-gray-500 mt-2">Gender: {creator.gender}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg">
              No creators found. Use the "Register New Creator" button to add one!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisteredCreators;
