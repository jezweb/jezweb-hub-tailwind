/**
 * AutocompleteField Component
 * 
 * This component provides an autocomplete input field that allows users to select
 * from existing options or add new ones. It's particularly useful for fields like
 * industries, tags, or categories where users might need to add new values.
 * 
 * The component uses the useFormFields hook to fetch existing values from Firebase
 * and allows adding new values on-the-fly.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useFormFields } from '../../hooks/useFormFields';
import Label from './Label';

/**
 * AutocompleteField component props
 */
interface AutocompleteFieldProps {
  fieldType: string; // The type of field to fetch values for (e.g., 'industries')
  label?: string; // Optional label for the field
  placeholder?: string; // Optional placeholder text
  initialValue?: string; // Optional initial value
  onChange: (value: string) => void; // Callback when value changes
  required?: boolean; // Whether the field is required
  error?: boolean; // Whether the field has an error
  hint?: string; // Optional hint text or error message
  className?: string; // Optional additional CSS classes
  allowNewValues?: boolean; // Whether to allow adding new values
}

/**
 * AutocompleteField component
 */
const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  fieldType,
  label,
  placeholder = 'Start typing...',
  initialValue = '',
  onChange,
  required = false,
  error = false,
  hint,
  className = '',
  allowNewValues = true
}) => {
  // Get field values from the hook
  const {
    fieldValues,
    loading,
    error: fetchError,
    addFieldValue
  } = useFormFields(fieldType);
  
  // Input value state
  const [inputValue, setInputValue] = useState<string>(initialValue);
  
  // Filtered suggestions state
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<{ value: string; label: string }>>([]);
  
  // Show suggestions state
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  // Selected suggestion index state
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
  
  // Adding new value state
  const [isAddingNewValue, setIsAddingNewValue] = useState<boolean>(false);
  
  // Ref for the suggestions container
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update input value when initialValue changes
  useEffect(() => {
    if (initialValue !== inputValue) {
      setInputValue(initialValue);
    }
  }, [initialValue]);
  
  // Filter suggestions when input value changes
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    
    const filtered = fieldValues.filter(field => 
      field.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      field.value.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    setFilteredSuggestions(filtered);
    
    // Check if the exact value exists
    const exactMatch = fieldValues.some(field => 
      field.label.toLowerCase() === inputValue.toLowerCase() ||
      field.value.toLowerCase() === inputValue.toLowerCase()
    );
    
    setIsAddingNewValue(allowNewValues && !exactMatch && inputValue.trim() !== '');
  }, [inputValue, fieldValues, allowNewValues]);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
    onChange(value);
  };
  
  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion: { value: string; label: string }) => {
    setInputValue(suggestion.label);
    setShowSuggestions(false);
    onChange(suggestion.value);
  };
  
  /**
   * Handle add new value
   */
  const handleAddNewValue = async () => {
    if (!allowNewValues || !inputValue.trim()) return;
    
    try {
      // Add new field value
      await addFieldValue(fieldType, {
        value: inputValue.trim(),
        label: inputValue.trim()
      });
      
      // Update input value and close suggestions
      setShowSuggestions(false);
      onChange(inputValue.trim());
    } catch (error) {
      console.error('Error adding new value:', error);
    }
  };
  
  /**
   * Handle key down events for keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If no suggestions are shown, don't handle keyboard navigation
    if (!showSuggestions) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length + (isAddingNewValue ? 0 : -1) ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length + (isAddingNewValue ? 0 : -1)
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex === -1) {
          // No suggestion selected, use current input value
          setShowSuggestions(false);
        } else if (selectedSuggestionIndex === filteredSuggestions.length) {
          // "Add new value" option selected
          handleAddNewValue();
        } else {
          // Suggestion selected
          handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {label && (
        <Label>
          {label} {required && <span className="text-meta-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`h-10 w-full rounded-lg border ${
            error
              ? 'border-danger bg-danger/[0.08] text-danger placeholder:text-danger/50'
              : 'border-gray-300 bg-white text-gray-700 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          } px-4 text-sm focus:outline-none`}
        />
        
        {showSuggestions && (filteredSuggestions.length > 0 || isAddingNewValue) && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
          >
            <ul className="max-h-60 overflow-y-auto py-1">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion.value}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedSuggestionIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  {suggestion.label}
                </li>
              ))}
              
              {isAddingNewValue && (
                <li
                  onClick={handleAddNewValue}
                  className={`cursor-pointer px-4 py-2 text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700 ${
                    selectedSuggestionIndex === filteredSuggestions.length ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  Add "{inputValue}"
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      {hint && (
        <p className={`mt-1 text-xs ${error ? 'text-danger' : 'text-gray-500 dark:text-gray-400'}`}>
          {hint}
        </p>
      )}
      
      {fetchError && (
        <p className="mt-1 text-xs text-danger">
          Error loading options: {fetchError.message}
        </p>
      )}
    </div>
  );
};

export default AutocompleteField;