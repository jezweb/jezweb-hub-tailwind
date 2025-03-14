/**
 * ColorPicker Component
 * 
 * This component provides a color picker interface with preset colors and a hex input.
 * It allows users to select from predefined colors or enter a custom hex color code.
 * 
 * The component is designed to be used in forms where color selection is required,
 * such as theme customisation, profile settings, etc.
 */

import React, { useState, useRef, useEffect } from 'react';

// Predefined color options
const presetColors = [
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

interface ColorPickerProps {
  initialColor?: string;
  onChange: (color: string) => void;
  className?: string;
  label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  initialColor = '#000000',
  onChange,
  className = '',
  label = 'Select Color'
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<string>(initialColor);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
    onChange(color);
    setIsOpen(false);
  };

  // Handle custom color input
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomColor(value);
    
    // Validate hex color format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      setSelectedColor(value);
      onChange(value);
    }
  };

  // Handle custom color input blur
  const handleCustomColorBlur = () => {
    // If invalid format, revert to selected color
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(customColor)) {
      setCustomColor(selectedColor);
    }
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
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={togglePicker}
          className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          aria-label="Toggle color picker"
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
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white p-3 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
            <div className="mb-3 grid grid-cols-5 gap-2">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                    selectedColor === color ? 'border-blue-500 dark:border-blue-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                ></button>
              ))}
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">Custom:</span>
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span 
                    className="inline-block h-4 w-4 rounded-full border border-gray-300" 
                    style={{ backgroundColor: customColor }}
                  ></span>
                </div>
                <input
                  type="text"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  onBlur={handleCustomColorBlur}
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  placeholder="#RRGGBB"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  title="Hex color code (e.g. #FF0000)"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;