import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-12 h-12 border-4 border-t-4 border-gray-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;