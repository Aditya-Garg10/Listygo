import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const FormInput = ({
  label,
  type,
  icon: Icon,
  value,
  onChange,
  placeholder,
  showPassword,
  toggleShowPassword,
  borderStyle = 'full',
  iconColor = '#3b82f6'
}) => {
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">
          {label}
        </label>
      )}
      
      <div className={`flex items-center relative ${
        borderStyle === 'full' 
          ? 'border border-gray-300 focus-within:border-blue-500 rounded-lg overflow-hidden transition-colors' 
          : 'border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors'
      }`}>
        {Icon && (
          <div className="pl-3 text-xl">
            <Icon size={18} color={iconColor} />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-3 px-3 focus:outline-none bg-transparent`}
        />
        
        {isPasswordField && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="pr-3 text-gray-500 hover:text-blue-600 transition-colors"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;