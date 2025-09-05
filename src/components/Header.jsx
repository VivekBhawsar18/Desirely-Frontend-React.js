import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const navText = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const navBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const activeBg = isDarkMode ? 'bg-gray-700' : 'bg-blue-100';
  const activeText = isDarkMode ? 'text-blue-300' : 'text-blue-700';

  return (
    <header className={`${navBg} shadow-lg border-b ${navBorder} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className={`text-xl font-bold ${navText} hover:text-blue-600 transition-colors duration-300`}>
            Desirely
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                isActive('/') 
                  ? `${activeBg} ${activeText}` 
                  : `${navText} hover:bg-gray-100 hover:text-gray-900`
              }`}
            >
              Creators
            </Link>
            <Link
              to="/register"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                isActive('/register') 
                  ? `${activeBg} ${activeText}` 
                  : `${navText} hover:bg-gray-100 hover:text-gray-900`
              }`}
            >
              Register Creator
            </Link>
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
