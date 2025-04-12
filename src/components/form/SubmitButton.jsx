import React from 'react';

const SubmitButton = ({
  text,
  loadingText,
  isLoading,
  onClick,
  color = 'blue',
  fullWidth = false,
  className = '',
  disabled = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${colorClasses[color]} 
        text-white px-4 py-2 rounded-lg
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        flex items-center justify-center
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'transform hover:-translate-y-0.5'}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </>
      ) : text}
    </button>
  );
};

export default SubmitButton;