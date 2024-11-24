import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import './SearchAndAddFriend.css';
import { useChat } from '../../../../../contexts/chatContext';

interface SearchAndAddFriendProps {
  currentUserEmail: string | null | undefined;
  onSearch: (searchValue: string) => void;
  onAddFriend: (email: string) => Promise<void>;
  searchValue: string;
}

const SearchAndAddFriend: React.FC<SearchAndAddFriendProps> = ({
  currentUserEmail,
  onSearch,
  onAddFriend,
  searchValue,
}) => {
  const [friendInput, setFriendInput] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ignoreNextClick, setIgnoreNextClick] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const {
    setAddedOrDeleted,
    setAddedOrDeletedFriend,
    setAddedOrRemovedFriendStatus,
  } = useChat();

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updatePopupPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.top,
        left: rect.right + 20, // 20px offset from the button
      });
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      updatePopupPosition();
    }
  }, [isPopupOpen]);

  useEffect(() => {
    if (isPopupOpen) {
      const handleResize = () => updatePopupPosition();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isPopupOpen]);

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
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen, ignoreNextClick]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
      setFriendInput('');
      setError(null);
      setIsPopupOpen(false);
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
      <input
        id="SearchUser-input"
        placeholder="Search user..."
        onChange={(e) => onSearch(e.target.value)}
        value={searchValue}
      />
      <IconButton
        ref={buttonRef}
        onClick={() => {
          setIgnoreNextClick(true);
          setIsPopupOpen(!isPopupOpen);
        }}
      >
        <AddCircleOutline id="AddFriends-button" />
      </IconButton>

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
