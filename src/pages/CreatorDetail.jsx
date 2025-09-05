import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS, API_STATUS } from '../appConstants';
import EditCreator from '../components/EditCreator';
import { useNotification } from '../components/NotificationProvider';

const CreatorDetail = ({ isDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError, showInfo } = useNotification();
  const [selectedCreator, setSelectedCreator] = useState(location.state?.creator || null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCreatorById = useCallback(async () => {
    setIsLoading(true);
    showInfo('Loading creator details...', 2000);
    try {
      const response = await fetch(API_ENDPOINTS.creators);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const creators = await response.json();
      const creator = creators.find(c => c._id === id);
      if (creator) {
        setSelectedCreator(creator);
      } else {
        showError('Creator not found', 4000);
      }
    } catch (error) {
      showError(`Failed to load creator: ${error.message}`, 5000);
    } finally {
      setIsLoading(false);
    }
  }, [id, showInfo, showError]);

  // If no creator in location state, fetch it by ID
  useEffect(() => {
    if (!selectedCreator && id) {
      fetchCreatorById();
    }
  }, [id, selectedCreator, fetchCreatorById]);



  const handleUpdateCreator = (updatedCreator) => {
    setSelectedCreator(updatedCreator);
    showSuccess(`Creator "${updatedCreator.name}" updated successfully!`, 4000);
    // Navigate back to home after a short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleDeleteCreator = async (creator) => {
    showInfo('Deleting creator...', 2000);
    try {
      const response = await fetch(API_ENDPOINTS.deleteCreator(creator._id), {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete creator');
      }
      showSuccess(`Creator "${creator.name}" deleted successfully!`, 4000);
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      showError(`Failed to delete creator: ${error.message}`, 5000);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (!selectedCreator) {
    return (
      <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
        <div className="text-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-lg">Loading creator details...</p>
            </div>
          ) : (
            <p className="text-lg">Creator not found</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <EditCreator
        selectedCreator={selectedCreator}
        onUpdate={handleUpdateCreator}
        onDelete={handleDeleteCreator}
        onGoBack={handleGoBack}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default CreatorDetail;
