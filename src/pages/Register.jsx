import React from 'react';
import RegisterCreator from '../components/RegisterCreator';

const Register = ({ isDarkMode }) => {
  return (
    <div className="flex-1">
      <RegisterCreator
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Register;
