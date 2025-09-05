import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, isDarkMode, toggleTheme }) => {
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="flex-1">
        {children}
      </main>
      {/* <Footer isDarkMode={isDarkMode} /> */}
    </div>
  );
};

export default Layout;
