import React from 'react';
import { Link } from 'react-router-dom';

const Login = ({ isDarkMode }) => {
  // Determine dark mode or light mode styles
  const mainBg = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  const inputBorder = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const linkColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const buttonBg = isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className={`flex flex-col items-center justify-center p-8 min-h-screen ${mainBg} transition-colors duration-300`}>
      <h1 className={`text-5xl font-dancing-script ${textColor} mb-8`}>Desirely</h1>
      <p className={`text-lg italic ${textColor} mb-8`}>Where fantasies come alive.</p>
      <form className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Phone number, username, or email"
          className={`w-full p-3 mb-2 text-sm border ${inputBorder} rounded-sm ${inputBg} ${textColor} focus:outline-none focus:ring-0`}
        />
        <input
          type="password"
          placeholder="Password"
          className={`w-full p-3 mb-4 text-sm border ${inputBorder} rounded-sm ${inputBg} ${textColor} focus:outline-none focus:ring-0`}
        />
        <button
          type="submit"
          className={`w-full py-1.5 rounded-md text-white font-semibold ${buttonBg} transition-colors duration-300`}
        >
          Log in
        </button>
      </form>
      <div className="flex items-center my-4 w-full max-w-sm">
        <div className={`flex-grow border-t ${inputBorder}`}></div>
        <span className={`mx-4 text-sm font-semibold ${textColor}`}>OR</span>
        <div className={`flex-grow border-t ${inputBorder}`}></div>
      </div>
      <button className={`w-full max-w-sm py-1.5 rounded-md font-semibold ${linkColor} hover:text-blue-700 transition-colors duration-300 flex items-center justify-center`}>
        {/* Google Icon SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 34.6 30.1 39 24 39c-5.8 0-10.7-3.9-12.5-9.2H4.4c2.8 5.7 8.9 9.8 16.6 9.8 9.8 0 18-5.3 22.5-13.4V20z" />
          <path fill="#34A853" d="M24 45c6.7 0 12.3-3.2 16.4-8.1l-4.2-3.3c-2.4 2.8-5.9 4.6-9.7 4.6-7.1 0-13-4.8-15.1-11.4l-4.1 3.2C8.5 40.8 15.6 45 24 45z" />
          <path fill="#FBBC05" d="M12.5 28.5c-.8-2.4-.8-4.9 0-7.3V18l-4.1-3.2C6.8 18 6.4 20.8 6.4 24c0 3.2.4 6 2.1 8.8l4-3.2z" />
          <path fill="#EA4335" d="M24 9.9c3.4 0 6.5 1.2 8.9 3.5l3.7-3.7c-4.4-4.2-10.2-6.7-16.6-6.7-7.4 0-13.6 4-17.1 9.9l4.1 3.2C11.1 14.8 16.6 9.9 24 9.9z" />
        </svg>
        <span className="text-sm">Log in with Google</span>
      </button>
      <Link to="#" className={`mt-4 text-xs ${linkColor} hover:underline`}>
        Forgot password?
      </Link>
      <p className={`mt-4 text-sm ${textColor}`}>
        Don't have an account?
        <Link to="/registeruser" className={`font-semibold ${linkColor} hover:underline ml-1`}>
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
