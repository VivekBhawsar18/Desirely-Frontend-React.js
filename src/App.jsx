import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Header from './components/Header';
import Home from './pages/Home';
import CreatorDetail from './pages/CreatorDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { NotificationProvider } from './components/NotificationProvider';
import RegisterUser from './pages/RegisterUser';

// Placeholder for authentication status. In a real app, this would be managed with a context or a global state.
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false
  
  // This useEffect simulates a check for a logged-in user, like from local storage or an API call.
  useEffect(() => {
    // In a real application, you would check for a token or user session here.
    // For demonstration purposes, we'll just set it to false.
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    // This is a placeholder for your actual login logic.
    // Once a user is authenticated, you would set isAuthenticated to true and store a token.
    localStorage.setItem('authToken', 'my-auth-token');
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Placeholder logout logic. Clear the token and set isAuthenticated to false.
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };
  
  return { isAuthenticated, login, logout };
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, login, logout } = useAuth();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <NotificationProvider>
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
          {/* Conditionally render the Header only if the user is authenticated */}
          {isAuthenticated && <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}

          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Public Routes - Accessible to all users */}
              <Route path="/login" element={<Login isDarkMode={isDarkMode} onLogin={login} />} />
              <Route path="/registeruser" element={<RegisterUser isDarkMode={isDarkMode} />} />
              
              {/* Protected Routes - Only accessible if isAuthenticated is true */}
              {isAuthenticated ? (
                <>
                  <Route path="/home" element={<Home isDarkMode={isDarkMode} />} />
                  <Route path="/creator/:id" element={<CreatorDetail isDarkMode={isDarkMode} />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
              
              {/* Fallback for unknown URLs */}
              <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
            </Routes>
          </main>
        </div>
      </NotificationProvider>
    </Router>
  );
};

export default App;
