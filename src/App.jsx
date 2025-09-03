import React, { useState, useEffect } from 'react';

// The main application component that handles all state, rendering, and logic.
const App = () => {
  // State to manage which page is currently displayed. 'list', 'register', or 'details'.
  const [currentPage, setCurrentPage] = useState('list');
  
  // State to hold the list of all creators fetched from the API.
  const [creators, setCreators] = useState([]);
  
  // State to hold the data for the currently selected creator.
  const [selectedCreator, setSelectedCreator] = useState(null);
  
  // State to provide user feedback on API calls (e.g., loading, success, error).
  const [apiStatus, setApiStatus] = useState('');

  // State for the creator registration form data.
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_id: '',
    gender: ''
  });

  // State for the search term and the filtered list of creators.
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCreators, setFilteredCreators] = useState([]);
  
  // State for the theme, defaulting to 'dark'.
  const [theme, setTheme] = useState('dark');

  // New state for the edited creator data
  const [editedCreator, setEditedCreator] = useState(null);

  // State for the image file to be uploaded.
  const [imageFile, setImageFile] = useState(null);
  
  // State to hold the temporary URL for the image preview.
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // A helper function to fetch data from the API.
  const fetchData = async (url) => {
    setApiStatus('Loading...');
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setApiStatus('Success');
      return data;
    } catch (error) {
      setApiStatus(`Error: ${error.message}`);
      console.error('API Fetch Error:', error);
      return null;
    }
  };

  // useEffect hook to fetch the list of creators when the component mounts or when the page changes to 'list'.
  useEffect(() => {
    setApiStatus('');
    const fetchCreators = async () => {
      const creatorsList = await fetchData('http://localhost:8000/api/creators');
      console.log('API Response:', creatorsList);
      if (creatorsList) {
        setCreators(creatorsList);
      }
    };

    if (currentPage === 'list') {
      fetchCreators();
    }
  }, [currentPage]);

  // useEffect hook to handle filtering the creators based on the search term.
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = creators.filter(creator => 
      creator.name.toLowerCase().includes(lowerCaseSearchTerm) || 
      creator.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredCreators(results);
  }, [searchTerm, creators]);
  
  // Clean up the image preview URL when the component unmounts or the file changes.
  useEffect(() => {
    if (!imageFile && imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
  }, [imageFile, imagePreviewUrl]);

  // Handler for clicking on a creator card in the list view.
  const handleCreatorClick = (creator) => {
    setApiStatus('');
    setSelectedCreator(creator);
    setEditedCreator(creator);
    setImageFile(null);
    setImagePreviewUrl(null);
    setCurrentPage('details');
  };

  // Handler for uploading an image on the details page.
  const handleImageUpload = async () => {
    if (!imageFile) {
      setApiStatus('Please select an image to upload.');
      return;
    }

    setApiStatus('Uploading image...');
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', imageFile);

    try {
      // First, upload the image to the backend
      const response = await fetch('http://localhost:8000/api/image/upload/', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Image upload failed');
      }

      const result = await response.json();
      const newImageId = result.id;
      
      // Then, update the creator with the new image ID
      const updateResponse = await fetch(`http://localhost:8000/api/creator/${selectedCreator._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_id: newImageId }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.detail || 'Creator update failed');
      }

      setApiStatus('Image uploaded and creator updated successfully!');
      setSelectedCreator({ ...selectedCreator, image_id: newImageId });

      // Reset the file input and preview after successful upload
      setImageFile(null);
      setImagePreviewUrl(null);

    } catch (error) {
      setApiStatus(`Error: ${error.message}`);
    }
  };
  
  // Handler for the registration form submission.
  const handleRegisterSubmit = async (e) => {
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
      setCurrentPage('list'); // Navigate back to the list after successful registration
    } catch (error) {
      setApiStatus(`Error: ${error.message}`);
    }
  };

  // Handler for the form input changes.
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Handler for editing creator information
  const handleEditedCreatorChange = (e) => {
    setEditedCreator({ ...editedCreator, [e.target.name]: e.target.value });
  };

  // Handler for updating a creator's details
  const handleUpdateCreator = async () => {
    setApiStatus('Updating creator...');
    try {
      const response = await fetch(`http://localhost:8000/api/creator/${editedCreator._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedCreator),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Creator update failed');
      }

      setApiStatus('Creator updated successfully!');
      setSelectedCreator(editedCreator); // Update the main selected creator state
      setCurrentPage('list'); // Navigate back to the list after successful update
    } catch (error) {
      setApiStatus(`Error: ${error.message}`);
    }
  };
  
  // Handler for deleting a creator.
  const handleDeleteCreator = async () => {
    // Custom modal instead of alert() or confirm()
    const isConfirmed = window.confirm(`Are you sure you want to delete ${selectedCreator.name}? This action cannot be undone.`);
    if (isConfirmed) {
      setApiStatus('Deleting creator...');
      try {
        const response = await fetch(`http://localhost:8000/api/creator/delete/${selectedCreator._id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to delete creator');
        }
        setApiStatus('Creator deleted successfully!');
        setCurrentPage('list'); // Navigate back to the list after deletion
      } catch (error) {
        setApiStatus(`Error: ${error.message}`);
      }
    }
  };
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Conditionally render the correct component based on currentPage state.
  const renderPage = () => {
    const isDarkMode = theme === 'dark';
    const cardBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
    const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
    const subtextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
    const accentColor = isDarkMode ? 'bg-gray-600' : 'bg-gray-300';
    const accentTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';

    switch (currentPage) {
      case 'list':
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
              <button
                onClick={() => setCurrentPage('register')}
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
              >
                Register New Creator
              </button>
            </div>
            
            <div className="mb-8 w-full max-w-lg">
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'}`}
              />
            </div>
            {apiStatus === 'Loading...' ? (
              <p className={`text-lg ${subtextColor}`}>Loading creators...</p>
            ) : apiStatus.startsWith('Error') ? (
              <p className="text-red-500 text-lg">{apiStatus}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {filteredCreators.length > 0 ? (
                  filteredCreators.map(creator => (
                    <div
                      key={creator._id}
                      className={`p-6 rounded-lg shadow-md transition-shadow duration-300 flex items-start space-x-4 ${cardBg}`}
                    >
                      <div className="relative">
                        {creator.image_id ? (
                          <img 
                            src={`http://localhost:8000/api/image/get/${creator.image_id}`} 
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
                            onClick={() => handleCreatorClick(creator)}
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
      case 'register':
        return (
          <div className={`flex flex-col items-center justify-start p-8 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <button
              onClick={() => setCurrentPage('list')}
              className={`mb-8 px-6 py-2 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 ${accentColor} ${accentTextColor}`}
            >
              ← Go Back
            </button>
            <div className={`container mx-auto max-w-lg p-8 rounded-lg shadow-lg ${cardBg}`}>
              <h1 className={`text-4xl font-bold mb-6 ${textColor}`}>Register a New Creator</h1>
              <form onSubmit={handleRegisterSubmit} className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className={`flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'}`}
                  />
                </div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'}`}
                />
                <input
                  type="text"
                  name="image_id"
                  placeholder="Image ID (optional)"
                  value={formData.image_id}
                  onChange={handleFormChange}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'}`}
                />
                <input
                  type="text"
                  name="gender"
                  placeholder="Gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  required
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'}`}
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
                >
                  Create Creator
                </button>
              </form>
              {apiStatus && <p className={`mt-4 text-center text-sm font-medium ${subtextColor}`}>{apiStatus}</p>}
            </div>
          </div>
        );
      case 'details':
        return (
          <div className={`flex flex-col items-center justify-start p-8 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <button
              onClick={() => setCurrentPage('list')}
              className={`mb-8 px-6 py-2 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 ${accentColor} ${accentTextColor}`}
            >
              ← Go Back
            </button>
            <div className={`container mx-auto max-w-4xl p-8 rounded-lg shadow-lg ${cardBg}`}>
              <h1 className={`text-4xl font-bold mb-4 ${textColor}`}>Edit {selectedCreator.name}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Creator Information Section */}
                <div>
                  <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Creator Information</h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleUpdateCreator(); }} className="flex flex-col space-y-4">
                    <label className={`${subtextColor}`}>
                      Name:
                      <input
                        type="text"
                        name="name"
                        value={editedCreator.name}
                        onChange={handleEditedCreatorChange}
                        className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'}`}
                      />
                    </label>
                    <label className={`${subtextColor}`}>
                      Description:
                      <textarea
                        name="description"
                        value={editedCreator.description}
                        onChange={handleEditedCreatorChange}
                        className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'}`}
                      />
                    </label>
                    <label className={`${subtextColor}`}>
                      Gender:
                      <input
                        type="text"
                        name="gender"
                        value={editedCreator.gender}
                        onChange={handleEditedCreatorChange}
                        className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'}`}
                      />
                    </label>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
                    >
                      Save Changes
                    </button>
                    {apiStatus && !apiStatus.includes('Image') && <p className={`mt-4 text-center text-sm font-medium ${apiStatus.includes('Error') ? 'text-red-500' : subtextColor}`}>{apiStatus}</p>}
                  </form>
                </div>

                {/* Image Upload Section */}
                <div className={`p-6 rounded-lg border border-gray-200 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Upload New Image</h2>
                  {selectedCreator.image_id && (
                    <div className="mb-4 flex flex-col items-center">
                      <p className={`text-sm mb-2 ${subtextColor}`}>Current Image:</p>
                      <img src={`http://localhost:8000/api/image/get/${selectedCreator.image_id}`} alt="Creator" className="w-48 h-48 object-cover rounded-lg shadow-lg" />
                    </div>
                  )}
                  {imagePreviewUrl && (
                    <div className="mb-4 flex flex-col items-center">
                      <p className={`text-sm mb-2 ${subtextColor}`}>New Image Preview:</p>
                      <img src={imagePreviewUrl} alt="Preview" className="w-48 h-48 object-cover rounded-lg shadow-lg" />
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                    className={`mb-4 w-full transition-colors duration-300 ${subtextColor}`}
                  />
                  <button
                    onClick={handleImageUpload}
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
                  >
                    Upload New Image
                  </button>
                  {apiStatus.includes('Image') && <p className={`mt-4 text-center text-sm font-medium ${apiStatus.includes('Error') ? 'text-red-500' : subtextColor}`}>{apiStatus}</p>}
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleDeleteCreator}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
                >
                  Delete Creator
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
};

export default App;
