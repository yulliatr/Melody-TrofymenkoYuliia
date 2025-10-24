import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MoodPage.css';
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import heart1 from '../assets/images/heart1.png';
import heart2 from '../assets/images/heart2.png';

const MoodPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [heartActive, setHeartActive] = useState(false);

  const moods = [
    { id: 1, text: 'Happy', top: 385, left: 187 },
    { id: 2, text: 'Motivated', top: 291, left: 457 },
    { id: 3, text: 'Relaxed', top: 291, left: 727 },
    { id: 4, text: 'Sad', top: 485, left: 457 },
    { id: 5, text: 'Romantic', top: 485, left: 727 },
    { id: 6, text: 'Angry', top: 385, left: 997 },
  ];

  const handleGenerate = () => {
    if (selectedMood) {
      setGenerated(true);
    }
  };

  return (
    <div className="mood-page">
      <div className="background">
        <div className="ellipse ellipse1"></div>
        <div className="ellipse ellipse2"></div>
        <div className="ellipse ellipse3"></div>
      </div>

      <header className="header">
        <Link to="/">
          <img src={image1} alt="Left icon" className="header-icon left-icon" />
        </Link>
        <Link to="/profile">
          <img
            src={image2}
            alt="Right icon"
            className="header-icon right-icon"
          />
        </Link>
      </header>

      <p className="mood-text">
        Find the perfect song for your current mood
        <br />
        Choose how you feel today — and we’ll suggest something that resonates.
      </p>

      {moods.map((mood) => (
        <button
          key={mood.id}
          className={`emotion-button ${selectedMood === mood.id ? 'selected' : ''}`}
          style={{ top: mood.top, left: mood.left }}
          onClick={() => setSelectedMood(mood.id)}
        >
          {mood.text}
        </button>
      ))}

      <button
        className="generate-button"
        style={{ top: 660, left: 548 }}
        onClick={handleGenerate}
      >
        GENERATE
      </button>

      <p className="song-for-you-text">Song For You:</p>

      {generated && (
        <>
          <p className="generated-track-text">
            Chemtrails Over The Country Club - Lana Del Ray
          </p>
          <img
            src={heartActive ? heart2 : heart1}
            alt="Heart"
            className="heart-icon"
            onClick={() => setHeartActive(!heartActive)}
          />
        </>
      )}
    </div>
  );
};

export default MoodPage;
