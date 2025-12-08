import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MoodPage.css';
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import heart1 from '../assets/images/heart1.png';
import heart2 from '../assets/images/heart2.png';
import useFetchData from '../hooks/useFetchData';
import { useAuth } from '../hooks/useAuth';
import useMutation from '../hooks/useMutation';

const moodsConfig = [
  { text: 'Happy', top: 385, left: 187 },
  { text: 'Motivated', top: 291, left: 457 },
  { text: 'Relaxed', top: 291, left: 727 },
  { text: 'Sad', top: 485, left: 457 },
  { text: 'Romantic', top: 485, left: 727 },
  { text: 'Christmas', top: 385, left: 997 },
];

const MoodPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [heartActive, setHeartActive] = useState(false);

  const {
    data: songsPool,
    isLoading: isLoadingSongs,
    isError: isSongsPoolError,
  } = useFetchData('songs/pool', []);

  const { mutate: saveSongMutation, isLoading: isSaving } =
    useMutation('saved_songs');

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setGeneratedTrack(null);
    setHeartActive(false);
  };

  const handleGenerate = () => {
    if (!selectedMood || isLoadingSongs) return;

    setGeneratedTrack(null);
    setHeartActive(false);

    const filteredSongs = songsPool.filter(
      (song) => song.mood.toLowerCase() === selectedMood.toLowerCase()
    );

    if (filteredSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredSongs.length);
      const generatedSong = filteredSongs[randomIndex];

      setGeneratedTrack(generatedSong);
    } else {
      setGeneratedTrack({
        title: 'No songs found',
        artist: 'Try another mood',
        id: 0,
      });
    }
  };

  const handleSaveSong = async () => {
    if (!generatedTrack || generatedTrack.id === 0) {
      alert('Please generate a valid song first.');
      return;
    }
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const songToSave = {
      userId: user._id,
      songId: generatedTrack._id || generatedTrack.id,
    };

    const result = await saveSongMutation('POST', songToSave);

    if (result) {
      setHeartActive(true);
      //alert(`'${generatedTrack.title}' saved successfully!`);
    } else if (isSaving) {
      //alert('Saving in progress...');
    } else {
      //alert('Failed to save song. Check server connection.');
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

      {moodsConfig.map((mood) => (
        <button
          key={mood.text}
          className={`emotion-button ${selectedMood === mood.text ? 'selected' : ''}`}
          style={{ top: mood.top, left: mood.left }}
          onClick={() => handleMoodSelect(mood.text)}
        >
          {mood.text}
        </button>
      ))}

      <button
        className="generate-button"
        style={{ top: 660, left: 548 }}
        onClick={handleGenerate}
        disabled={!selectedMood || isLoadingSongs || isSaving}
      >
        {isLoadingSongs ? 'Loading...' : 'GENERATE'}
      </button>

      {isSongsPoolError && (
        <p className="error-message-center">
          Error connecting to music server.
        </p>
      )}

      <p className="song-for-you-text">Song For You:</p>

      {generatedTrack && generatedTrack.title !== 'No songs found' && (
        <div className="result-wrapper">
          <p className="generated-track-text">
            {generatedTrack.title} - {generatedTrack.artist}
          </p>
          <img
            src={heartActive ? heart2 : heart1}
            alt="Heart"
            className="heart-icon"
            onClick={handleSaveSong}
            style={{ opacity: isSaving ? 0.5 : 1 }}
          />
        </div>
      )}
      {generatedTrack && generatedTrack.title === 'No songs found' && (
        <p className="generated-track-text">
          {generatedTrack.title} - {generatedTrack.artist}
        </p>
      )}
    </div>
  );
};

export default MoodPage;
