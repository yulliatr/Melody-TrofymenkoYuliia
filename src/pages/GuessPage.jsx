import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GuessPage.css';
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import playButton from '../assets/images/play-button.png';
import waveSound from '../assets/images/wave-sound.png';
import pauseButton from '../assets/images/pause-button.png';
import useFetchData from '../hooks/useFetchData';
import useMutation from '../hooks/useMutation';
import { useAuth } from '../hooks/useAuth';

const buttonPositions = {
  option1: { top: 482, left: 188 },
  option2: { top: 482, left: 728 },
  option3: { top: 619, left: 188 },
  option4: { top: 619, left: 728 },
};

const GuessPage = ({ testUser }) => {
  const auth = testUser
    ? { user: testUser, isAuthenticated: true, updateUserContext: () => {} }
    : useAuth();
  const { user, isAuthenticated, updateUserContext } = auth;
  const navigate = useNavigate();

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [played, setPlayed] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [locked, setLocked] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    data: quizData,
    isLoading: isLoadingQuiz,
    refetch: refetchQuiz,
  } = useFetchData('quiz/generate', null);
  const { mutate: submitAnswerMutation, isLoading: isSubmitting } = useMutation(
    'quiz/submit',
    (updatedUserStats) => {
      if (updatedUserStats && updatedUserStats.user) {
        updateUserContext(updatedUserStats.user);
      }
    }
  );

  useEffect(() => {
    if (quizData) {
      const shuffledOptions = [...quizData.options];
      const correctIndex = Math.floor(Math.random() * 4);
      shuffledOptions.splice(
        correctIndex,
        0,
        shuffledOptions.splice(
          shuffledOptions.findIndex((o) => o.id === quizData.correctAnswerId),
          1
        )[0]
      );

      const positionedOptions = shuffledOptions.map((opt, i) => ({
        ...opt,
        position: buttonPositions['option' + (i + 1)],
      }));

      setCurrentQuiz({ ...quizData, options: positionedOptions });
      setPlayed(false);
      setSelectedId(null);
      setLocked(false);
      setResultMessage(null);
      setCurrentAudioUrl(null);
      setIsPlaying(false);
    }
  }, [quizData]);

  const BASE_URL = 'http://localhost:3000';

  const handlePlayAgain = () => {
    setPlayed(false);
    setSelectedId(null);
    setLocked(false);
    setResultMessage(null);
    setCurrentAudioUrl(null);
    setIsPlaying(false);

    navigate(0);
  };

  const handlePlay = () => {
    if (isLoadingQuiz || !currentQuiz) return;
    const correctOption = currentQuiz.options.find(
      (o) => o.id === currentQuiz.correctAnswerId
    );
    const audioUrl = BASE_URL + correctOption.audioSrc;

    if (!played) {
      setPlayed(true);
    }

    if (isPlaying) {
      setIsPlaying(false);
      setCurrentAudioUrl(null);
    } else {
      setIsPlaying(true);
      setCurrentAudioUrl(audioUrl);
    }
  };

  const handleAnswer = async (selectedOptionId) => {
    if (!currentQuiz || !played || locked || isSubmitting) return;
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    setSelectedId(selectedOptionId);
    setLocked(true);
    setIsPlaying(false);
    setCurrentAudioUrl(null);

    const isCorrect = currentQuiz.correctAnswerId === selectedOptionId;

    await submitAnswerMutation('POST', {
      userId: user._id,
      selectedId: selectedOptionId,
      correctId: currentQuiz.correctAnswerId,
      isCorrect: isCorrect,
    });

    const newStreak = isCorrect ? (user?.stats?.currentStrike ?? 0) + 1 : 0;

    const correctOption = currentQuiz.options.find(
      (opt) => opt.id === currentQuiz.correctAnswerId
    );

    if (isCorrect) {
      setResultMessage({
        text: `That’s right! You nailed it.<br />Current Streak: ${newStreak}🔥`,
        style: {
          top: 826,
          color: 'white',
          letterSpacing: '0.15em',
          fontWeight: 600,
        },
        centered: true,
      });
    } else {
      setResultMessage({
        text: `Oops! The song was ‘${correctOption.title} – ${correctOption.artist}’<br />Current Streak: 0🔥`,
        style: {
          top: 826,
          color: 'white',
          letterSpacing: '0.15em',
          fontWeight: 600,
        },
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

  const getButtonDefault = (option, index) => {
    if (!played) return `Option ${index + 1}`;
    return getButtonContent(option.title, option.artist);
  };

  const getButtonClass = (id) => {
    if (!locked) return '';
    if (id === selectedId && id !== currentQuiz.correctAnswerId)
      return 'wrong-selected';
    if (locked && id === currentQuiz.correctAnswerId) return 'correct-answer';
    return '';
  };

  return (
    <div className="guess-page">
      <div className="background">
        <div className="ellipse ellipse1"></div>
        <div className="ellipse ellipse2"></div>
        <div className="ellipse ellipse3"></div>
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
          src={isPlaying ? pauseButton : playButton}
          alt="Play/Pause"
          className="play-button"
          onClick={handlePlay}
        />
        {[128, 186, 244, 302, 360, 418].map((left, i) => (
          <img
            key={i}
            src={waveSound}
            alt={`Wave ${i}`}
            className="wave-icon"
            style={{ top: 12, left }}
          />
        ))}
      </div>
      {currentQuiz &&
        currentQuiz.options.map((option, index) => (
          <button
            key={option.id}
            className={`option-button ${getButtonClass(option.id)}`}
            style={{ top: option.position.top, left: option.position.left }}
            onClick={() => handleAnswer(option.id)}
            disabled={locked || isLoadingQuiz || isSubmitting}
          >
            {getButtonDefault(option, index)}
          </button>
        ))}

      {resultMessage && (
        <p
          className="result-message centered-feedback"
          style={resultMessage.style}
          dangerouslySetInnerHTML={{ __html: resultMessage.text }}
        ></p>
      )}

      {resultMessage && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(826px + 100px)',
            left: '42%',
            transform: 'translateX(-50%)',
            zIndex: 20,
          }}
        >
          <button
            className="option-button"
            style={{ width: 250, height: 60, fontSize: 20, fontWeight: 700 }}
            onClick={handlePlayAgain}
          >
            Play Again
          </button>
        </div>
      )}

      {currentAudioUrl && (
        <audio
          src={currentAudioUrl}
          autoPlay
          key={currentAudioUrl}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentAudioUrl(null);
          }}
        />
      )}
    </div>
  );
};

export default GuessPage;
