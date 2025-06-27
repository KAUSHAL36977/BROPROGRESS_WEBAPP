import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="neo-brutalist bg-white dark:bg-black p-8 text-center">
        <div className="spinner mx-auto mb-4"></div>
        <div className="font-black uppercase text-lg">LOADING BRO PROGRESS</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Getting your gains ready...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 