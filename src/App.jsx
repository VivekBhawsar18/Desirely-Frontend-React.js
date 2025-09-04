import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API_STATUS } from './appConstants';
import RegisteredCreators from './components/RegisteredCreators';
import RegisterCreator from './components/RegisterCreator';
import EditCreator from './components/EditCreator';

const App = () => {
  const [currentPage, setCurrentPage] = useState('list');
  const [creators, setCreators] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [apiStatus, setApiStatus] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCreators = async () => {
    setApiStatus(API_STATUS.loading);
    try {
      const response = await fetch(API_ENDPOINTS.creators);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCreators(data);
      setApiStatus('');
    } catch (error) {
      setApiStatus(`${API_STATUS.error}: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [currentPage]);

  const handleSelectCreator = (creator) => {
    setSelectedCreator(creator);
    setCurrentPage('details');
  };

  const handleUpdateCreator = (updatedCreator) => {
    setSelectedCreator(updatedCreator);
    fetchCreators();
    setCurrentPage('list');
  };

  const handleDeleteCreator = async (creator) => {
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    setShowDeleteModal(false);
    setApiStatus(API_STATUS.loading);
    try {
      const response = await fetch(API_ENDPOINTS.deleteCreator(selectedCreator._id), {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete creator');
      }
      setApiStatus('Creator deleted successfully!');
      fetchCreators();
      setCurrentPage('list');
    } catch (error) {
      setApiStatus(`${API_STATUS.error}: ${error.message}`);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'list':
        return (
          <RegisteredCreators
            creators={creators}
            apiStatus={apiStatus}
            onSelectCreator={handleSelectCreator}
            onRegisterClick={() => setCurrentPage('register')}
            onRefresh={fetchCreators}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
        );
      case 'register':
        return (
          <RegisterCreator
            onGoBack={() => setCurrentPage('list')}
            isDarkMode={isDarkMode}
          />
        );
      case 'details':
        return (
          <EditCreator
            selectedCreator={selectedCreator}
            onUpdate={handleUpdateCreator}
            onDelete={handleDeleteCreator}
            onGoBack={() => setCurrentPage('list')}
            isDarkMode={isDarkMode}
          />
        );
      default:
        return null;
    }
  };

  const modalBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const modalText = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const modalBtnPrimary = "bg-red-600 hover:bg-red-700 text-white";
  const modalBtnSecondary = "bg-gray-300 hover:bg-gray-400 text-gray-800";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {renderPage()}
      
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`p-8 rounded-lg shadow-xl ${modalBg}`}>
            <h2 className={`text-xl font-bold mb-4 ${modalText}`}>Confirm Deletion</h2>
            <p className={`mb-6 ${modalText}`}>Are you sure you want to delete {selectedCreator?.name}? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${modalBtnSecondary}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${modalBtnPrimary}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
