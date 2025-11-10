import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProfilePage.css';
import image1 from '../assets/images/image1.png';
import avatar from '../assets/images/avatar.png';
import pencil from '../assets/images/pencil.png';
import playIcon from '../assets/images/play-icon.png';
import removeIcon from '../assets/images/remove-icon.png';

const initialSongs = [
  { id: 1, title: 'Tears', artist: 'Sabrina Carpenter' },
  { id: 2, title: 'Deja Vu', artist: 'Olivia Rodrigo' },
  { id: 3, title: 'Summertime Sadness', artist: 'Lana Del Rey' },
  { id: 4, title: 'Daylight', artist: 'David Kushner' },
  { id: 5, title: 'Couldn’t Make It Any Harder', artist: 'Sabrina Carpenter' },
  { id: 6, title: 'Starships', artist: 'Niki Minaj' },
  { id: 7, title: 'Deslocado', artist: 'NAPA' },
  { id: 8, title: 'Manchild', artist: 'Sabrina Carpenter' },
];

const SavedSong = ({ song, onPlay, onRemove }) => (
  <div className="saved-song-item">
    <img
      src={playIcon}
      alt="Play Song"
      className="song-action-icon play-icon"
      onClick={() => onPlay(song.id)}
    />

    <span className="song-title">{song.title}</span>
    <span className="song-artist">{song.artist}</span>

    <img
      src={removeIcon}
      alt="Remove Song"
      className="song-action-icon remove-icon"
      onClick={() => onRemove(song.id)}
    />
  </div>
);

const ProfilePage = () => {
  const [savedSongs, setSavedSongs] = useState(initialSongs);
  const [username, setUsername] = useState('Yulis');
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);

  const handlePlaySong = (songId) => {
    console.log(`Playing song with ID: ${songId}`);
  };

  const handleRemoveSong = (songId) => {
    setSavedSongs(savedSongs.filter((song) => song.id !== songId));
    console.log(`Removed song with ID: ${songId}`);
  };

  const handleEditAvatar = () => {
    alert('Функція зміни аватара викликана!');
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUsernameKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsUsernameEditing(false);
    }
  };

  const handleUsernameBlur = () => {
    setIsUsernameEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="background">
        <div className="ellipse ellipse1"></div>
        <div className="ellipse ellipse2"></div>
        <div className="ellipse ellipse3"></div>
      </div>

      <header className="header">
        <Link to="/">
          <img src={image1} alt="Home icon" className="header-icon left-icon" />
        </Link>
        <span className="greeting">Hi, {username}!</span>
        <Link to="/logout" className="logout-link">
          Log Out
        </Link>
      </header>

      <div className="profile-content-wrapper">
        <div className="profile-details-section">
          <div className="profile-card">
            <div className="avatar-section">
              <img src={avatar} alt="User Avatar" className="avatar-image" />
              <img
                src={pencil}
                alt="Edit Avatar"
                className="edit-icon"
                onClick={handleEditAvatar}
              />
            </div>

            <div className="user-details">
              <div className="detail-row">
                <span className="detail-label">Username:</span>
                {isUsernameEditing ? (
                  <input
                    type="text"
                    className="username-input"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameBlur}
                    onKeyDown={handleUsernameKeyDown}
                    autoFocus
                  />
                ) : (
                  <span className="detail-value">{username}</span>
                )}
                <img
                  src={pencil}
                  alt="Edit Username"
                  className="edit-detail-icon"
                  onClick={() => setIsUsernameEditing(true)}
                />
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">example@gmail.com</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Joined:</span>
                <span className="detail-value">11 October 2025</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="stats-title">Game Statistics</h2>
            <div className="stats-row">
              <span>Total Games Played:</span>
              <span className="stats-value">54</span>
            </div>
            <div className="stats-row">
              <span>Correct Answers:</span>
              <span className="stats-value">37</span>
            </div>
            <div className="stats-row">
              <span>Longest Strike:</span>
              <span className="stats-value">6 🔥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="saved-songs-section">
        <h2 className="saved-songs-title">Saved Songs:</h2>
        <div className="songs-list">
          {savedSongs.map((song) => (
            <SavedSong
              key={song.id}
              song={song}
              onPlay={handlePlaySong}
              onRemove={handleRemoveSong}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
