/**
 * PhoneField Component
 * 
 * This component provides a styled phone input field with country code selection
 * that matches the TailAdmin design system. It uses the PhoneInput component
 * from TailAdmin for the core functionality.
 * 
 * Features:
 * - Country code selection
 * - TailAdmin-styled interface
 * - Error handling and validation
 * - Dark mode support
 * - Accessibility features
 * - Default to AU country code
 */

import React, { useState, useEffect } from 'react';
import Label from '../form/Label';
import PhoneInput from '../form/group-input/PhoneInput';

// Define country codes
const countries = [
  { code: "AU", label: "+61" }, // Australia (default)
  { code: "US", label: "+1" },  // United States
  { code: "GB", label: "+44" }, // United Kingdom
  { code: "NZ", label: "+64" }, // New Zealand
  { code: "CA", label: "+1" },  // Canada
  { code: "DE", label: "+49" }, // Germany
  { code: "FR", label: "+33" }, // France
  { code: "JP", label: "+81" }, // Japan
  { code: "CN", label: "+86" }, // China
  { code: "IN", label: "+91" }, // India
  { code: "SG", label: "+65" }, // Singapore
];

interface PhoneFieldProps {
  label?: string;
  initialValue?: string;
  onChange: (value: string, isValid: boolean) => void;
  className?: string;
  error?: boolean;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  defaultCountry?: string;
  selectPosition?: "start" | "end";
}

const PhoneField: React.FC<PhoneFieldProps> = ({
  label = 'Phone',
  initialValue = '',
  onChange,
  className = '',
  error = false,
  hint = '',
  disabled = false,
  defaultCountry = 'AU',
  required = false,
  placeholder = '+61 (0) 000-000-000',
  selectPosition = 'start'
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isValid, setIsValid] = useState<boolean>(true);
  
  // Validate phone number format
  const validatePhone = (phone: string): boolean => {
    if (!phone && !required) return true;
    // Basic validation - can be enhanced for specific country formats
    return phone.length >= 8;
  };
  
  // Handle phone number change
  const handlePhoneChange = (phoneNumber: string) => {
    setValue(phoneNumber);
    
    const valid = validatePhone(phoneNumber);
    setIsValid(valid);
    
    onChange(phoneNumber, valid);
  };
  
  // Generate error message
  const errorMessage = hint || 'Please enter a valid phone number';
  
  return (
    <div className={`${className}`}>
      {label && (
        <Label htmlFor="phone-input">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <PhoneInput
          countries={countries}
          placeholder={placeholder}
          onChange={handlePhoneChange}
          selectPosition={selectPosition}
          defaultCountry={defaultCountry}
        />
      </div>
      
      {(error || !isValid) && (
        <p className="mt-1 text-sm text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PhoneField;