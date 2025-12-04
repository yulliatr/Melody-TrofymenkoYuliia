import React from 'react';
import './AvatarSelector.css';

const AvatarSelector = ({ options, currentUrl, onSelect, onClose }) => {
  const handleSelection = (url) => {
    onSelect(url);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2 className="modal-title">Select New Avatar</h2>

        <div className="avatar-grid">
          {options.map((url, index) => (
            <div
              key={index}
              className={`avatar-option ${url === currentUrl ? 'selected' : ''}`}
              onClick={() => handleSelection(url)}
            >
              <img
                src={url}
                alt={`Avatar ${index + 1}`}
                className="avatar-image-preview"
              />
            </div>
          ))}
        </div>

        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default AvatarSelector;
