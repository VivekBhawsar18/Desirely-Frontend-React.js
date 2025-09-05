// Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../appConstants';
import RegisteredCreators from '../components/RegisteredCreators';

const Home = ({ isDarkMode }) => {
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCreators = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.creators);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCreators(data);
    } catch (error) {
      console.error("Failed to load creators:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleSelectCreator = (creator) => {
    navigate(`/creator/${creator._id}`, { state: { creator } });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="flex-1">
      <RegisteredCreators
        creators={creators}
        isLoading={isLoading}
        onSelectCreator={handleSelectCreator}
        onRegisterClick={handleRegisterClick}
        onRefresh={fetchCreators}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Home;
