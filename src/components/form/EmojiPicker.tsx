/**
 * EmojiPicker Component
 * 
 * This component provides a simple emoji picker interface.
 * It displays a set of commonly used emojis and allows the user to select one.
 * 
 * The component is designed to be used in forms where emoji selection is required,
 * such as reaction buttons, status indicators, etc.
 */

import React, { useState, useRef, useEffect } from 'react';

// Common emojis to choose from
const commonEmojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '😴', '🤤', '😪', '😵', '🤐', '🥴',
  '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '👍', '👎',
  '👏', '🙌', '👋', '🤝', '👊', '✌️', '🤞', '🤟', '🤘', '👌',
  '👈', '👉', '👆', '👇', '💪', '🙏', '💯', '❤️', '🧡', '💛',
  '💚', '💙', '💜', '🖤', '💔', '💕', '💞', '💓', '💗', '💖',
  '💘', '💝', '💟', '🌟', '⭐', '🔥', '💧', '❄️', '💦', '💨',
];

interface EmojiPickerProps {
  initialEmoji?: string;
  onChange: (emoji: string) => void;
  className?: string;
  label?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  initialEmoji = '',
  onChange,
  className = '',
  label = 'Select Emoji'
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>(initialEmoji);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
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
          aria-label="Toggle emoji picker"
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
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 sm:text-sm">
            <div className="grid grid-cols-8 gap-1 p-2">
              {commonEmojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedEmoji === emoji ? 'bg-blue-100 dark:bg-blue-900' : ''
                  }`}
                  aria-label={`Emoji ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;