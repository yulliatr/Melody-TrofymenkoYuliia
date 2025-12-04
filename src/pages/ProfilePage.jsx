import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import image1 from '../assets/images/image1.png';
import avatar from '../assets/images/avatar.png';
import pencil from '../assets/images/pencil.png';
import playIcon from '../assets/images/play-icon.png';
import pauseIcon from '../assets/images/pause-icon.png';
import removeIcon from '../assets/images/remove-icon.png';
import { useAuth } from '../hooks/useAuth';
import useFetchData from '../hooks/useFetchData';
import useMutation from '../hooks/useMutation';
import AvatarSelector from '../components/AvatarSelector';
import avatar1 from '../assets/images/avatar1.png';
import avatar2 from '../assets/images/avatar2.png';
import avatar3 from '../assets/images/avatar3.png';
import avatar4 from '../assets/images/avatar4.png';
import avatar5 from '../assets/images/avatar5.png';

const AVATAR_OPTIONS = [avatar, avatar1, avatar2, avatar3, avatar4, avatar5];

const SavedSong = ({ song, onPlay, onRemove, isPlaying }) => (
  <div className="saved-song-item">
    <img
      src={isPlaying ? pauseIcon : playIcon}
      alt={isPlaying ? 'Pause Song' : 'Play Song'}
      className="song-action-icon play-icon"
      onClick={() => onPlay(song.id, song.audioSrc)}
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
  const { user, logout, updateUserContext } = useAuth();
  const navigate = useNavigate();

  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [username, setUsername] = useState(user?.username || 'Guest');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || avatar);
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const { mutate: updateProfileMutation } = useMutation(
    'users',
    (updatedUser) => {
      setUsername(updatedUser.username);
      setAvatarUrl(updatedUser.avatarUrl);
      updateUserContext(updatedUser);
    }
  );

  const {
    data: savedSongs,
    isLoading: isLoadingSongs,
    setData: setSavedSongs,
    isError: isSongsError,
  } = useFetchData(`saved_songs?userId=${user?.id}`, []);

  const { mutate: deleteSongMutation } = useMutation('saved_songs', () => {});

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePlaySong = (songId, audioSrc) => {
    if (currentlyPlayingId === songId) {
      setCurrentlyPlayingId(null);
      setCurrentAudioUrl(null);
    } else {
      setCurrentlyPlayingId(songId);
      setCurrentAudioUrl(audioSrc);
    }
  };

  const handleRemoveSong = async (songIdToDelete) => {
    deleteSongMutation('DELETE', null, songIdToDelete);

    setSavedSongs((prev) => prev.filter((song) => song.id !== songIdToDelete));

    if (currentlyPlayingId === songIdToDelete) {
      setCurrentlyPlayingId(null);
      setCurrentAudioUrl(null);
    }
  };

  const handleEditAvatar = () => setIsAvatarModalOpen(true);

  const handleSelectNewAvatar = async (newUrl) => {
    setIsAvatarModalOpen(false);
    if (!newUrl) return;
    await updateProfileMutation(
      'PATCH',
      { avatarUrl: newUrl, username, email: user.email },
      user.id
    );
    setAvatarUrl(newUrl);
  };

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleUsernameKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsUsernameEditing(false);
      updateProfileMutation(
        'PATCH',
        { username, avatarUrl, email: user.email },
        user.id
      );
    }
  };
  const handleUsernameBlur = () => {
    setIsUsernameEditing(false);
    if (username !== user?.username) {
      updateProfileMutation(
        'PATCH',
        { username, avatarUrl, email: user.email },
        user.id
      );
    }
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
        <span onClick={handleLogout} className="logout-link">
          Log Out
        </span>
      </header>

      <div className="profile-content-wrapper">
        <div className="profile-details-section">
          <div className="profile-card">
            <div className="avatar-section">
              <img src={avatarUrl} alt="User Avatar" className="avatar-image" />
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
                <span className="detail-value">{user?.email || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Joined:</span>
                <span className="detail-value">{user?.joined || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h2 className="stats-title">Game Statistics</h2>
            <div className="stats-row">
              <span>Total Games Played:</span>
              <span className="stats-value">
                {user?.stats?.gamesPlayed || 0}
              </span>
            </div>
            <div className="stats-row">
              <span>Correct Answers:</span>
              <span className="stats-value">
                {user?.stats?.correctAnswers || 0}
              </span>
            </div>
            <div className="stats-row">
              <span>Longest Strike:</span>
              <span className="stats-value">
                {user?.stats?.longestStrike || 0} 🔥
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="saved-songs-section">
        <h2 className="saved-songs-title">Saved Songs:</h2>
        {isLoadingSongs ? (
          <p style={{ color: '#0294B0', marginTop: '20px', fontSize: '18px' }}>
            Loading saved songs...
          </p>
        ) : isSongsError ? (
          <p style={{ color: 'red', marginTop: '20px', fontSize: '18px' }}>
            Error loading songs.
          </p>
        ) : savedSongs.length === 0 ? (
          <p style={{ color: '#0294B0', marginTop: '20px', fontSize: '18px' }}>
            You don't have any saved songs yet.
          </p>
        ) : (
          <div className="songs-list">
            {savedSongs.map((song) => (
              <SavedSong
                key={song.id}
                song={song}
                onPlay={handlePlaySong}
                onRemove={handleRemoveSong}
                isPlaying={currentlyPlayingId === song.id}
              />
            ))}
          </div>
        )}
      </div>

      {currentAudioUrl && (
        <audio
          id="global-audio-player"
          src={currentAudioUrl}
          autoPlay
          key={currentAudioUrl}
          onEnded={() => {
            setCurrentlyPlayingId(null);
            setCurrentAudioUrl(null);
          }}
        />
      )}

      {isAvatarModalOpen && (
        <AvatarSelector
          options={AVATAR_OPTIONS}
          currentUrl={avatarUrl}
          onSelect={handleSelectNewAvatar}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
