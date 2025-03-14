/**
 * AutocompleteSelect Component
 * 
 * This component provides an autocomplete select input that allows users to
 * type and filter options. It's designed to be used in forms where users
 * need to select from a potentially large list of options.
 * 
 * Features:
 * - Type to filter options
 * - Keyboard navigation
 * - Accessible design
 * - Customisable styling
 */

import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface AutocompleteSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  disabled = false
}) => {
  // State for input value, selected value, filtered options, and dropdown visibility
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  
  // Refs for the component and input
  const componentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Set initial input value based on default value
  useEffect(() => {
    if (defaultValue) {
      const option = options.find(opt => opt.value === defaultValue);
      if (option) {
        setInputValue(option.label);
      }
    }
  }, [defaultValue, options]);
  
  // Filter options when input value changes
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredOptions(options);
      return;
    }
    
    const filtered = options.filter(option => 
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setHighlightedIndex(filtered.length > 0 ? 0 : -1);
  }, [inputValue, options]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };
  
  // Handle option selection
  const handleSelectOption = (option: Option) => {
    setSelectedValue(option.value);
    setInputValue(option.label);
    setIsOpen(false);
    onChange(option.value);
  };
  
  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(prev => !prev);
      if (!isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  return (
    <div 
      ref={componentRef} 
      className={`relative ${className}`}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
            disabled ? "cursor-not-allowed opacity-70" : ""
          }`}
        />
        <button
          type="button"
          onClick={toggleDropdown}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          aria-label={isOpen ? "Close options" : "Open options"}
          tabIndex={-1}
          disabled={disabled}
        >
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg dark:bg-gray-800">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              No options found
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleSelectOption(option)}
                className={`cursor-pointer px-4 py-2 text-sm ${
                  index === highlightedIndex
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                    : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                }`}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSelect;