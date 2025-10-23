import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GuessPage.css';
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import playButton from '../assets/images/play-button.png';
import waveSound from '../assets/images/wave-sound.png';

const buttonPositions = {
  option1: { top: 482, left: 188 },
  option2: { top: 482, left: 728 },
  option3: { top: 619, left: 188 },
  option4: { top: 619, left: 728 },
};

const options = [
  {
    id: 1,
    title: 'Birds Of The Feather',
    artist: 'Billie Eilish',
    position: buttonPositions.option1,
  },
  {
    id: 2,
    title: 'Abracadabra',
    artist: 'Lady Gaga',
    position: buttonPositions.option2,
  },
  { id: 3, title: 'DVD', artist: 'Shmiska', position: buttonPositions.option3 },
  {
    id: 4,
    title: 'House Tour',
    artist: 'Sabrina Carpenter',
    position: buttonPositions.option4,
    isCorrect: true,
  },
];

const GuessPage = () => {
  const [played, setPlayed] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [locked, setLocked] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  const CORRECT_ID = 4;
  const CORRECT_ANSWER_TEXT = 'House Tour – Sabrina Carpenter';

  const handlePlay = () => {
    setPlayed(true);
  };

  const handleAnswer = (id) => {
    if (!played || locked) return;

    setSelectedId(id);
    setLocked(true);

    const isCorrect = id === CORRECT_ID;

    if (isCorrect) {
      setResultMessage({
        text: 'That’s right! You nailed it.<br />Current Streak: : 1🔥',
        style: {
          top: 826,
          color: 'white',
          letterSpacing: '0.15em',
          fontWeight: 600,
        },
        className: 'correct-message',
        centered: true,
      });
    } else {
      setResultMessage({
        text: `Oops! The song was ‘${CORRECT_ANSWER_TEXT}’<br />Current Streak: : 0🔥`,
        style: {
          top: 826,
          color: 'white',
          letterSpacing: '0.15em',
          fontWeight: 600,
        },
        className: 'wrong-message',
        centered: true,
      });
    }
  };

  const getButtonContent = (title, artist) => (
    <>
      <span className="title-text">{title}</span>
      <span className="artist-text">{artist}</span>
    </>
  );

  const getButtonClass = (id) => {
    if (!locked) return '';

    if (id === selectedId && id !== CORRECT_ID) return 'wrong-selected';

    if (id === CORRECT_ID) return 'correct-answer';

    return '';
  };

  const getButtonDefault = (id) => {
    if (!played) return `Option ${id}`;

    const option = options.find((o) => o.id === id);
    return getButtonContent(option.title, option.artist);
  };

  return (
    <div className="guess-page">
      <div className="background">
        <div className="ellipse ellipse1"></div>
        <div class="ellipse ellipse2"></div>
        <div class="ellipse ellipse3"></div>
      </div>

      <header className="header">
        <Link to="/">
          <img src={image1} alt="Home icon" className="header-icon left-icon" />
        </Link>
        <Link to="/profile">
          <img
            src={image2}
            alt="Profile icon"
            className="header-icon right-icon"
          />
        </Link>
      </header>

      <div className="instructions-text">
        GAME INSTRUCTIONS:
        <br />
        1. Press <span className="highlight">Play</span> to listen to a short
        melody.
        <br />
        2. Choose the correct song title from 4 options.
        <br />
        3. If you guess right — your <span className="highlight">
          strike
        </span>{' '}
        increases!
        <br />
        4. Make a mistake, and your streak resets to zero.
      </div>

      <div className="audio-container">
        <img
          src={playButton}
          alt="Play"
          className="play-button"
          onClick={handlePlay}
        />
        <img
          src={waveSound}
          alt="Wave 1"
          className="wave-icon"
          style={{ top: 12, left: 128 }}
        />
        <img
          src={waveSound}
          alt="Wave 2"
          className="wave-icon"
          style={{ top: 12, left: 186 }}
        />
        <img
          src={waveSound}
          alt="Wave 3"
          className="wave-icon"
          style={{ top: 12, left: 244 }}
        />
        <img
          src={waveSound}
          alt="Wave 4"
          className="wave-icon"
          style={{ top: 12, left: 302 }}
        />
        <img
          src={waveSound}
          alt="Wave 5"
          className="wave-icon"
          style={{ top: 12, left: 360 }}
        />
        <img
          src={waveSound}
          alt="Wave 6"
          className="wave-icon"
          style={{ top: 12, left: 418 }}
        />
      </div>

      {options.map((option) => (
        <button
          key={option.id}
          className={`option-button ${getButtonClass(option.id)}`}
          style={{ top: option.position.top, left: option.position.left }}
          onClick={() => handleAnswer(option.id)}
        >
          {getButtonDefault(option.id)}
        </button>
      ))}

      {resultMessage && (
        <p
          className={`result-message ${resultMessage.centered ? 'centered-feedback' : ''}`}
          style={resultMessage.style}
          dangerouslySetInnerHTML={{ __html: resultMessage.text }}
        ></p>
      )}
    </div>
  );
};

export default GuessPage;
