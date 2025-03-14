/**
 * EmojiPickerField Component
 * 
 * This component provides a wrapper around the emoji-picker-react library
 * with styling that matches the TailAdmin design system.
 * 
 * It allows users to select an emoji from a comprehensive picker interface
 * and displays the selected emoji with appropriate styling.
 * 
 * Features:
 * - Integration with emoji-picker-react
 * - TailAdmin-styled interface
 * - Error handling and validation
 * - Dark mode support
 * - Accessibility features
 */

import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import Label from '../form/Label';

interface EmojiPickerFieldProps {
  label?: string;
  initialEmoji?: string;
  onChange: (emoji: string) => void;
  className?: string;
  error?: boolean;
  hint?: string;
  disabled?: boolean;
}

const EmojiPickerField: React.FC<EmojiPickerFieldProps> = ({
  label = 'Select Emoji',
  initialEmoji = '',
  onChange,
  className = '',
  error = false,
  hint = '',
  disabled = false
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>(initialEmoji);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handle emoji selection
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    setSelectedEmoji(emoji);
    onChange(emoji);
    setIsOpen(false);
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

  // Toggle the emoji picker
  const togglePicker = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Determine if dark mode is active
  const isDarkMode = () => {
    return document.documentElement.classList.contains('dark');
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <Label htmlFor="emoji-picker">
          {label}
        </Label>
      )}
      
      <div className="relative">
        <button
          type="button"
          id="emoji-picker"
          onClick={togglePicker}
          disabled={disabled}
          className={`flex h-11 w-full items-center justify-between rounded-lg border ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800'
          } bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-3 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600`}
          aria-label="Toggle emoji picker"
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-haspopup="listbox"
        >
          <span className="flex items-center">
            {selectedEmoji ? (
              <span className="mr-2 text-2xl">{selectedEmoji}</span>
            ) : null}
            <span>{selectedEmoji ? 'Selected Emoji' : 'Select an emoji'}</span>
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
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              autoFocusSearch={false}
              theme={isDarkMode() ? Theme.DARK : Theme.LIGHT}
              width="100%"
              height="350px"
              lazyLoadEmojis={true}
            />
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

export default EmojiPickerField;