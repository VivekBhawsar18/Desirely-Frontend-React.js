import React, { useState } from 'react';
import { API_ENDPOINTS } from '../appConstants';

const RegisterCreator = ({ onGoBack, isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_id: '',
    gender: ''
  });
  const [apiStatus, setApiStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiStatus('Creating creator...');
    try {
      const response = await fetch(API_ENDPOINTS.creator, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create creator');
      }

      const result = await response.json();
      setApiStatus(`Creator created successfully! ID: ${result._id}`);
      setFormData({
        name: '',
        description: '',
        image_id: '',
        gender: ''
      });
      // Optionally navigate back to the list
      setTimeout(() => onGoBack(), 2000);
    } catch (error) {
      setApiStatus(`Error: ${error.message}`);
    }
  };

  const cardBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const subtextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  const accentColor = isDarkMode ? 'bg-gray-600' : 'bg-gray-300';
  const accentTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';

  return (
    <div className={`flex flex-col items-center justify-start p-8 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <button
        onClick={onGoBack}
        className={`mb-8 px-6 py-2 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 ${accentColor} ${accentTextColor}`}
      >
        ← Go Back
      </button>
      <div className={`container mx-auto max-w-lg p-8 rounded-lg shadow-lg ${cardBg}`}>
        <h1 className={`text-4xl font-bold mb-6 ${textColor}`}>Register a New Creator</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${inputBg}`}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className={`p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none transition-colors duration-300 ${inputBg}`}
          />
          <input
            type="text"
            name="image_id"
            placeholder="Image ID (optional)"
            value={formData.image_id}
            onChange={handleChange}
            className={`p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${inputBg}`}
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className={`p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${inputBg}`}
          />
          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Creator
          </button>
        </form>
        {apiStatus && <p className={`mt-4 text-center text-sm font-medium ${apiStatus.includes('Error') ? 'text-red-500' : subtextColor}`}>{apiStatus}</p>}
      </div>
    </div>
  );
};

export default RegisterCreator;
