import React, {Fragment, useEffect, useRef, useState} from "react";
import {useAuth} from "../../contexts/authContext";
import Logo from '../../media/logo.svg';
import '../../global.css';
import {useHistory} from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Settings.css'
import {deleteAllUserConversations, deleteUser, getUser, setProfilePhoto} from "../../backend/endpoints";
import {User} from "../../backend/types";
import {doSignOut} from "../../firebase/auth";
import {cleanupCache} from "../Chats/Components/ChatFeedFriendPanel/ChatFeedFriendPanel";

// Define the language options with ISO-639 codes
const languageOptions = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Estonian' },
  { code: 'tl', name: 'Filipino' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'iw', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ko', name: 'Korean' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mr', name: 'Marathi' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
];

const Settings: React.FC = () => {
  const { currentUser, currentUserAccessToken } = useAuth();
  const history = useHistory();
  const [backendUser, setBackendUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[e.target.files.length - 1];
    if (file) {
      try {
        await setProfilePhoto(currentUserAccessToken, file);
        setBackendUser(await getUser(currentUserAccessToken || "", currentUser?.email || ""));

        const profilePicElement = document.getElementById('ProfilePic-icon') as HTMLImageElement;
        profilePicElement.src = `${backendUser?.photoUrl || ""}`;

        cleanupCache()
      } catch(err) {
        console.error(err);
      }
    }
  };

  const getLanguageName = (code: string): string => {
    const language = languageOptions.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  const attachFile = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUserAccessToken || !currentUser?.email) {
        return;
      }

      try {
        const user = await getUser(currentUserAccessToken, currentUser.email);
        setBackendUser(user);
        setSelectedLanguage(user.language || "");
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, [currentUserAccessToken, currentUser?.email]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('language-dropdown-container');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setIsDropdownOpen(false);
    console.log("save new language:", languageCode);
  };

  return (
    <div className="Settings vh-100"
         style={{
           backgroundColor: "var(--background-color2)",
           color: '#000000',
           fontSize: '40px'
         }}>
      <div className="row">
        <div className="col-sm-1">
          <button
            className="btn m-4 fs-1 d-flex justify-content-start"
            onClick={() => history.push("/chats")}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
        </div>
        <div className="col justify-items-center pt-4">
          <img
            src={Logo}
            alt="Logo"
            style={{width: '200px'}}
          />
        </div>
        <div className="col-sm-1"></div>
      </div>
      <div className="row">
        <div className="col-md"></div>
        <div className="col-md w-25"
             style={{borderRight: '6px solid white'}}>
          <div style={{position: 'relative', display: 'inline-block'}}>
            <img
              className="row"
              id="ProfilePic-icon"
              src={backendUser?.photoUrl || undefined}
              alt="Profile icon"
              style={{width: '200px', height: '200px'}}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{display: 'none'}}
              onChange={handleProfilePicChange}
            />
            <button
              className="btn btn-transparent position-absolute p-2"
              onClick={() => attachFile()}
              style={{
                bottom: '-20px',
                right: '-30px'
              }}
            >
              <i className="bi bi-camera display-3"
                 style={{
                   fontSize: '60px',
                   color: '#43A656'
                 }}>
              </i>
            </button>
          </div>
          <h1 className="row d-flex justify-content-md-center">
            {backendUser?.displayName}
          </h1>
          <h1 className="row d-flex justify-content-center" style={{fontSize: '26px'}}>
            {currentUser?.email}
          </h1>
        </div>
        <div className="col-md w-25 flex-column d-flex align-items-start" >
          <h1>Settings</h1>
          <div className="mt-5">
            <h1 className="input-header">Change Name:</h1>
            <div className="d-flex align-items-center">
              <input
                className="form-control"
                placeholder={backendUser?.displayName || undefined}
              />
              <button
                className="btn submit-input m-1 p-0 fs-3"
                onClick={() => console.log("save new displayName")}
                style={{width: '50px'}}
                id="Submit-name-change"
              >
                <i className="bi bi-arrow-up-right"></i>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="input-header">Change Language:</h1>
            <div
              className="dropdown d-flex align-items-center"
              id="language-dropdown-container"
              style={{position: 'relative'}}
            >
              <button
                className="btn dropdown-toggle"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ced4da',
                  minWidth: '250px',
                  textAlign: 'left'
                }}
              >
                {selectedLanguage ? getLanguageName(selectedLanguage) : 'Select Language'}
              </button>
              {isDropdownOpen && (
                <div
                  className="dropdown-menu show"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000
                  }}
                >
                  {languageOptions.map((language) => (
                    <button
                      key={language.code}
                      className={`dropdown-item ${selectedLanguage === language.code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(language.code)}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
              <button
                className="btn submit-input m-1 p-0 fs-3"
                onClick={() => console.log("save new language selection")}
                style={{width: '40px'}}
                id="Submit-language-change"
              >
                <i className="bi bi-arrow-up-right"></i>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <button
              className="btn dangerous-button m-1 p-0 fs-3"
              onClick={async () => {
                try {
                  await deleteAllUserConversations(currentUserAccessToken);
                } catch (error) {
                  console.error('Error deleting conversations:', error);
                }
              }}
              style={{width: '300px'}}
              id="Delete-all-messages"
            >
              Delete All Messages
            </button>
          </div>
          <div className="mt-4">
            <button
              className="btn dangerous-button m-1 p-0 fs-3"
              onClick={async () => {
                try {
                  cleanupCache();
                  await doSignOut();
                  await deleteUser(currentUserAccessToken);
                  history.push('/');
                } catch (error) {
                  console.error('Error deleting user:', error);
                }
              }}
              style={{width: '300px'}}
              id="Delete-account"
            >
              Delete Account
            </button>
          </div>
        </div>
        <div className="col-md"></div>

      </div>
    </div>
  );
};

export default Settings;