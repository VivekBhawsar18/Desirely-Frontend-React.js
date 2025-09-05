import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../appConstants';
import { useNotification } from './NotificationProvider';

const EditCreator = ({ selectedCreator, onUpdate, onDelete, isDarkMode }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();
  const [editedCreator, setEditedCreator] = useState(selectedCreator);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    setEditedCreator(selectedCreator);
    setImageFile(null);
    setImagePreviewUrl(null);
  }, [selectedCreator]);

  useEffect(() => {
    if (!imageFile && imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
  }, [imageFile, imagePreviewUrl]);

  const handleEditedCreatorChange = (e) => {
    setEditedCreator({ ...editedCreator, [e.target.name]: e.target.value });
  };

  const handleUpdateCreator = async () => {
    setIsUpdating(true);
    showInfo('Updating creator...', 2000);
    
    try {
      const response = await fetch(API_ENDPOINTS.updateCreator(editedCreator._id), {
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

      showSuccess(`Creator "${editedCreator.name}" updated successfully!`, 4000);
      onUpdate(editedCreator);
    } catch (error) {
      showError(`Failed to update creator: ${error.message}`, 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      showWarning('Please select an image to upload.', 3000);
      return;
    }

    setIsUploading(true);
    showInfo('Uploading image...', 2000);

    const uploadFormData = new FormData();
    uploadFormData.append('file', imageFile);

    try {
      const response = await fetch(API_ENDPOINTS.image.upload, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Image upload failed');
      }

      const result = await response.json();
      const newImageId = result.id;

      const updateResponse = await fetch(API_ENDPOINTS.updateCreator(selectedCreator._id), {
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

      showSuccess('Image uploaded and creator updated successfully!', 4000);
      const updatedCreator = { ...editedCreator, image_id: newImageId };
      setEditedCreator(updatedCreator);
      onUpdate(updatedCreator);
      setImageFile(null);
      setImagePreviewUrl(null);
    } catch (error) {
      showError(`Failed to upload image: ${error.message}`, 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const cardBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const subtextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  const accentColor = isDarkMode ? 'bg-gray-600' : 'bg-gray-300';
  const accentTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';

  return (
    <div className={`flex flex-col items-center justify-start p-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <button
        onClick={() => navigate('/')}
        className={`mb-8 px-6 py-2 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 ${accentColor} ${accentTextColor}`}
      >
        ← Go Back
      </button>
      <div className={`container mx-auto max-w-4xl p-8 rounded-lg shadow-lg ${cardBg}`}>
        <h1 className={`text-4xl font-bold mb-4 ${textColor}`}>Edit {selectedCreator.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
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
                  className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${inputBg}`}
                />
              </label>
              <label className={`${subtextColor}`}>
                Description:
                <textarea
                  name="description"
                  value={editedCreator.description}
                  onChange={handleEditedCreatorChange}
                  className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none transition-colors duration-300 ${inputBg}`}
                />
              </label>
              <label className={`${subtextColor}`}>
                Gender:
                <input
                  type="text"
                  name="gender"
                  value={editedCreator.gender}
                  onChange={handleEditedCreatorChange}
                  className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${inputBg}`}
                />
              </label>
                             <button
                 type="submit"
                 disabled={isUpdating}
                 className={`w-full px-6 py-3 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out ${
                   isUpdating 
                     ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                     : 'bg-green-600 text-white hover:bg-green-700'
                 }`}
               >
                 {isUpdating ? 'Saving...' : 'Save Changes'}
               </button>
            </form>
          </div>
          <div className={`p-6 rounded-lg border border-gray-200 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Upload New Image</h2>
            {selectedCreator.image_id && (
              <div className="mb-4 flex flex-col items-center">
                <p className={`text-sm mb-2 ${subtextColor}`}>Current Image:</p>
                <img src={API_ENDPOINTS.image.get(selectedCreator.image_id)} alt="Creator" className="w-48 h-48 object-cover rounded-lg shadow-lg" />
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
               disabled={isUploading}
               className={`w-full px-6 py-3 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out ${
                 isUploading 
                   ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                   : 'bg-green-600 text-white hover:bg-green-700'
               }`}
             >
               {isUploading ? 'Uploading...' : 'Upload New Image'}
             </button>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onDelete(selectedCreator)}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Delete Creator
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCreator;
