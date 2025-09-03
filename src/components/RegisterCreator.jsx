import React, { useState } from 'react';

const RegisterCreator = ({ onGoBack }) => {
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
      const response = await fetch('http://localhost:8000/api/creator', {
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
    } catch (error) {
      setApiStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start p-8 bg-gray-100 min-h-screen">
      <button
        onClick={onGoBack}
        className="mb-8 px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300"
      >
        ← Go Back
      </button>
      <div className="container mx-auto max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Register a New Creator</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          />
          <input
            type="text"
            name="image_id"
            placeholder="Image ID (optional)"
            value={formData.image_id}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Creator
          </button>
        </form>
        {apiStatus && <p className="mt-4 text-center text-sm font-medium text-gray-700">{apiStatus}</p>}
      </div>
    </div>
  );
};

export default RegisterCreator;
