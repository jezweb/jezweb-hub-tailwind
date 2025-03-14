/**
 * ColorPickerField Component
 * 
 * This component provides a wrapper around the TwitterPicker from react-color
 * with styling that matches the TailAdmin design system.
 * 
 * It allows users to select a color from a predefined palette or enter a custom
 * hex color code, with the selected color displayed in a preview.
 * 
 * Features:
 * - Integration with TwitterPicker from react-color
 * - TailAdmin-styled interface
 * - Error handling and validation
 * - Dark mode support
 * - Custom color input
 */

import React, { useState, useRef, useEffect } from 'react';
import { TwitterPicker } from 'react-color';
import Label from '../form/Label';

// Default color palette
const defaultColors = [
  '#FF6B6B', // Red
  '#FF9E7D', // Coral
  '#FFCA3A', // Yellow
  '#8AE86E', // Green
  '#64C8FF', // Blue
  '#6A67CE', // Indigo
  '#B57BFF', // Purple
  '#FF7DFF', // Pink
  '#FFFFFF', // White
  '#CCCCCC', // Light Gray
  '#888888', // Gray
  '#444444', // Dark Gray
  '#000000', // Black
];

interface ColorPickerFieldProps {
  label?: string;
  initialColor?: string;
  onChange: (color: string) => void;
  className?: string;
  error?: boolean;
  hint?: string;
  disabled?: boolean;
  colors?: string[];
}

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  label = 'Select Color',
  initialColor = '#000000',
  onChange,
  className = '',
  error = false,
  hint = '',
  disabled = false,
  colors = defaultColors
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handle color selection
  const handleColorChange = (color: any) => {
    const hexColor = color.hex;
    setSelectedColor(hexColor);
    onChange(hexColor);
  };

  // Handle click outside to close the picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle the color picker
  const togglePicker = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <Label htmlFor="color-picker">
          {label}
        </Label>
      )}
      
      <div className="relative">
        <button
          type="button"
          id="color-picker"
          onClick={togglePicker}
          disabled={disabled}
          className={`flex h-11 w-full items-center justify-between rounded-lg border ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800'
          } bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-3 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600`}
          aria-label="Toggle color picker"
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-haspopup="dialog"
        >
          <span className="flex items-center">
            <span 
              className="mr-2 inline-block h-5 w-5 rounded-full border border-gray-300" 
              style={{ backgroundColor: selectedColor }}
            ></span>
            <span>{selectedColor}</span>
          </span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full">
            <div className="rounded-md bg-white p-3 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
              <TwitterPicker 
                color={selectedColor}
                colors={colors}
                onChange={handleColorChange}
                triangle="hide"
                width="100%"
              />
            </div>
          </div>
        )}
      </div>
      
      {hint && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default ColorPickerField;