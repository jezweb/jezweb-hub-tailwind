/**
 * EmailField Component
 * 
 * This component provides a styled email input field that matches the TailAdmin design system.
 * It includes validation for email format and displays appropriate error messages.
 * 
 * Features:
 * - Email format validation
 * - TailAdmin-styled interface
 * - Error handling and validation
 * - Dark mode support
 * - Accessibility features
 */

import React, { useState, useEffect } from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { EnvelopeIcon } from '../../icons';

interface EmailFieldProps {
  label?: string;
  initialValue?: string;
  onChange: (value: string, isValid: boolean) => void;
  className?: string;
  error?: boolean;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

const EmailField: React.FC<EmailFieldProps> = ({
  label = 'Email',
  initialValue = '',
  onChange,
  className = '',
  error = false,
  hint = '',
  disabled = false,
  required = false,
  placeholder = 'Enter your email address'
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [touched, setTouched] = useState<boolean>(false);
  
  // Validate email format
  const validateEmail = (email: string): boolean => {
    if (!email && !required) return true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setTouched(true);
    
    const valid = validateEmail(newValue);
    setIsValid(valid);
    
    onChange(newValue, valid);
  };
  
  // Determine if we should show an error
  const showError = (error || (touched && !isValid));
  
  // Generate error message
  const errorMessage = hint || 'Please enter a valid email address';
  
  return (
    <div className={`${className}`}>
      {label && (
        <Label htmlFor="email-input">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id="email-input"
          type="email"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          error={showError}
          hint={showError ? errorMessage : ''}
          className="pl-[62px]"
        />
        <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <EnvelopeIcon className="size-6" />
        </span>
      </div>
    </div>
  );
};

export default EmailField;