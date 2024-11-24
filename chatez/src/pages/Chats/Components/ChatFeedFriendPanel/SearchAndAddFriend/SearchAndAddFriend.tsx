import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import './SearchAndAddFriend.css';
import { useChat } from '../../../../../contexts/chatContext';

/**
 * Props interface for the SearchAndAddFriend component
 * @interface SearchAndAddFriendProps
 * @property {string | null | undefined} currentUserEmail - Email of the currently logged in user
 * @property {function} onSearch - Callback function to handle search input changes
 * @property {function} onAddFriend - Async callback function to handle adding a new friend
 * @property {string} searchValue - Current value of the search input
 */
interface SearchAndAddFriendProps {
  currentUserEmail: string | null | undefined;
  onSearch: (searchValue: string) => void;
  onAddFriend: (email: string) => Promise<void>;
  searchValue: string;
}

/**
 * SearchAndAddFriend Component
 * Provides functionality to search existing friends and add new friends via email
 * Features include:
 * - Search input for filtering friends
 * - Add friend button that opens a popup
 * - Email validation
 * - Error handling for invalid inputs
 * - Responsive popup positioning
 */
const SearchAndAddFriend: React.FC<SearchAndAddFriendProps> = ({
  currentUserEmail,
  onSearch,
  onAddFriend,
  searchValue,
}) => {
  // State management for friend addition form
  const [friendInput, setFriendInput] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ignoreNextClick, setIgnoreNextClick] = useState(false);

  // Refs for popup positioning and click detection
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Context hooks for managing friend addition status
  const {
    setAddedOrDeleted,
    setAddedOrDeletedFriend,
    setAddedOrRemovedFriendStatus,
  } = useChat();

  // State for popup position
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  /**
   * Updates the popup position relative to the add friend button
   * Called when popup opens and on window resize
   */
  const updatePopupPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.top,
        left: rect.right + 20, // 20px offset from the button
      });
    }
  };

  // Update popup position when it opens
  useEffect(() => {
    if (isPopupOpen) {
      updatePopupPosition();
    }
  }, [isPopupOpen]);

  // Handle window resize events
  useEffect(() => {
    if (isPopupOpen) {
      const handleResize = () => updatePopupPosition();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isPopupOpen]);

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ignoreNextClick) {
        setIgnoreNextClick(false);
        return;
      }

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
        setError(null);
        setFriendInput('');
      }
    };

    if (isPopupOpen) {
      // Delay to prevent immediate closure
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen, ignoreNextClick]);

  /**
   * Validates email format using regex
   * @param {string} email - Email address to validate
   * @returns {boolean} - True if email is valid, false otherwise
   */
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handles changes to the friend email input
   * Validates input and sets appropriate error messages
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFriendInput(email);

    if (error) setError(null);

    if (email.length > 0) {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
      } else if (
        currentUserEmail &&
        email.toLowerCase() === currentUserEmail.toLowerCase()
      ) {
        setError("You can't add yourself as a friend");
      }
    }
  };

  /**
   * Handles the friend addition process
   * Validates input, calls the onAddFriend callback,
   * and manages UI state (errors, success, popup visibility)
   */
  const handleAddFriend = async () => {
    if (!friendInput) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(friendInput)) {
      setError('Please enter a valid email address');
      return;
    }

    if (
      currentUserEmail &&
      friendInput.toLowerCase() === currentUserEmail.toLowerCase()
    ) {
      setError("You can't add yourself as a friend");
      return;
    }

    try {
      await onAddFriend(friendInput);
      // Reset form state on success
      setFriendInput('');
      setError(null);
      setIsPopupOpen(false);
      // Update chat context
      setAddedOrDeleted('added');
      setAddedOrDeletedFriend(friendInput);
      setAddedOrRemovedFriendStatus(true);
    } catch (error) {
      setError('Failed to add friend. Please try again.');
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div className="Top-section">
      {/* Search input for existing friends */}
      <input
        id="SearchUser-input"
        placeholder="Search user..."
        onChange={(e) => onSearch(e.target.value)}
        value={searchValue}
      />

      {/* Add friend button that triggers popup */}
      <IconButton
        ref={buttonRef}
        onClick={() => {
          setIgnoreNextClick(true);
          setIsPopupOpen(!isPopupOpen);
        }}
      >
        <AddCircleOutline id="AddFriends-button" />
      </IconButton>

      {/* Popup form for adding new friend */}
      <div
        ref={popupRef}
        className={`popup-content ${isPopupOpen ? 'active' : ''}`}
        style={{
          top: `${popupPosition.top}px`,
          left: `${popupPosition.left}px`,
        }}
      >
        <div className="popup-header">Add Friend</div>
        <input
          className={`popup-input ${error ? 'error' : ''}`}
          placeholder="Enter friend's email"
          type="email"
          value={friendInput}
          onChange={handleEmailChange}
        />
        <div className="error-message">{error}</div>
        <button
          className="popup-button"
          onClick={handleAddFriend}
          disabled={!!error || !friendInput}
        >
          Add Friend
        </button>
      </div>
    </div>
  );
};

export default SearchAndAddFriend;
