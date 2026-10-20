import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Subject,
  Player,
  TimeMode,
  BoardTile,
  QuestionCard,
  ChallengeCard,
  StoryCard,
  LuckCard,
  QuestionLevel,
  TileType,
} from '../../types/game';
import { BOARD_TILES, TILE_META } from '../../data/boardConfig';
import questionsData from '../../data/questions.json';
import { CURRICULUM_QUESTIONS } from '../../data/curriculumQuestions';
import { CharacterAvatar } from '../common/CharacterAvatar';
import { CharacterPawn } from '../common/CharacterPawn';
import { audio } from '../../utils/audio';
import { speech } from '../../utils/speech';
import {
  Volume2,
  Clock,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Flame,
  Award,
  Layers,
  Pause,
  Play,
  Home,
  Trophy,
} from 'lucide-react';

interface GameBoardScreenProps {
  subject: Subject;
  players: Player[];
  timeMode: TimeMode;
  enableLuckCards: boolean;
  materiFilter?: string;
  onFinishGame: (finalPlayers: Player[], playDurationSec: number) => void;
  onNavigateHome: () => void;
  darkMode?: boolean;
}

// Real board game dice face with authentic pips (dots)
const DicePipsFace: React.FC<{ value: number }> = ({ value }) => {
  const isPipActive = (row: number, col: number) => {
    if (value === 1) return row === 1 && col === 1;
    if (value === 2) return (row === 0 && col === 0) || (row === 2 && col === 2);
    if (value === 3) return (row === 0 && col === 0) || (row === 1 && col === 1) || (row === 2 && col === 2);
    if (value === 4) return (row === 0 || row === 2) && (col === 0 || col === 2);
    if (value === 5) return ((row === 0 || row === 2) && (col === 0 || col === 2)) || (row === 1 && col === 1);
    if (value === 6) return (row === 0 || row === 1 || row === 2) && (col === 0 || col === 2);
    return false;
  };

  return (
    <div className="w-full h-full p-1.5 sm:p-2 grid grid-cols-3 grid-rows-3 items-center justify-items-center">
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <div key={`${r}-${c}`} className="w-full h-full flex items-center justify-center">
            {isPipActive(r, c) && (
              <span
                className={`rounded-full transition-transform ${
                  value === 1
                    ? 'w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 bg-rose-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] scale-110'
                    : 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-900 dark:bg-slate-950 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export const GameBoardScreen: React.FC<GameBoardScreenProps> = ({
  subject,
  players: initialPlayers,
  timeMode,
  enableLuckCards,
  materiFilter,
  onFinishGame,
  onNavigateHome,
  darkMode,
}) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMovingPawn, setIsMovingPawn] = useState<boolean>(false);
  const [activeTile, setActiveTile] = useState<BoardTile | null>(null);

  // Active Card Modal State
  const [activeCardType, setActiveCardType] = useState<TileType | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuestionCard | null>(null);
  const [selectedQuestionLevel, setSelectedQuestionLevel] = useState<QuestionLevel>('low');
  const [activeChallenge, setActiveChallenge] = useState<ChallengeCard | null>(null);
  const [activeStory, setActiveStory] = useState<StoryCard | null>(null);
  const [activeLuck, setActiveLuck] = useState<LuckCard | null>(null);

  // Tracking question codes used in current session to prevent quick repetition
  const [usedQuestionCodes, setUsedQuestionCodes] = useState<string[]>([]);
  const [teacherApproved, setTeacherApproved] = useState<boolean>(false);

  // Answer states
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [shortAnswerInput, setShortAnswerInput] = useState<string>('');
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [storyAnswerMode, setStoryAnswerMode] = useState<'bicara' | 'tulis' | 'peragakan'>('bicara');
  const [storyTextInput, setStoryTextInput] = useState<string>('');

  // Timer State
  const initialSeconds = timeMode === '30m' ? 30 * 60 : timeMode === '60m' ? 60 * 60 : 0;
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Sound & Speech
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);

  // Finish rank counter
  const nextFinishRankRef = useRef<number>(1);

  // Timer Effect - Stops ticking while game is paused
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      if (timeMode !== 'unlimited') {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeMode, isPaused, isGameOver]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    handleFinalRanking();
  };

  const currentPlayer = players[currentPlayerIndex];

  // Roll Dice and hop pawns
  const handleRollDice = () => {
    if (isRolling || isMovingPawn || activeCardType !== null || currentPlayer.isFinished || isPaused) {
      return;
    }

    setIsRolling(true);
    audio.playDiceRoll();

    // Roll animation
    let rollTicks = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollTicks++;
      if (rollTicks > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        hopPawnStepByStep(finalValue);
      }
    }, 80);
  };

  // Pawn hops tile by tile
  const hopPawnStepByStep = async (steps: number) => {
    setIsMovingPawn(true);
    const startTile = currentPlayer.currentTile;
    const targetTile = Math.min(50, startTile + steps);

    for (let t = startTile + 1; t <= targetTile; t++) {
      await new Promise((res) => setTimeout(res, 350));
      audio.playPawnHop();
      setPlayers((prev) =>
        prev.map((p, idx) => (idx === currentPlayerIndex ? { ...p, currentTile: t } : p))
      );
    }

    setIsMovingPawn(false);

    // Check if player reached tile 50 (SEKOLAH - FINISH)
    if (targetTile === 50) {
      handlePlayerFinish(currentPlayerIndex);
    } else {
      // Trigger card according to landed tile
      const landedTile = BOARD_TILES.find((b) => b.number === targetTile) || BOARD_TILES[0];
      setActiveTile(landedTile);
      openCardForTile(landedTile.type);
    }
  };

  const handlePlayerFinish = (playerIdx: number) => {
    const rank = nextFinishRankRef.current;
    nextFinishRankRef.current += 1;

    audio.playVictory();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === playerIdx ? { ...p, isFinished: true, finishRank: rank, score: p.score + 5 } : p
      )
    );

    // Check if all players have finished
    const updatedFinishedCount = players.filter((p) => p.isFinished).length + 1;
    if (updatedFinishedCount >= players.length) {
      setTimeout(() => {
        handleFinalRanking();
      }, 1800);
    } else {
      setTimeout(() => {
        passToNextActivePlayer();
      }, 1500);
    }
  };

  // Open corresponding card modal
  const openCardForTile = (type: TileType) => {
    audio.playCardDraw();
    setActiveCardType(type);
    setAnswerSubmitted(false);
    setSelectedOption('');
    setShortAnswerInput('');
    setStoryTextInput('');
    setTeacherApproved(false);

    if (type === 'low' || type === 'middle' || type === 'high') {
      setSelectedQuestionLevel(type);
      loadQuestionByLevel(type);
    } else if (type === 'science' || type === 'fun' || type === 'story') {
      // Tantangan Istimewa (TI): loaded from the curriculum TI questions!
      loadTantanganIstimewaQuestion();
    } else if (type === 'luck') {
      if (!enableLuckCards) {
        // Fallback to middle question if luck cards disabled
        openCardForTile('middle');
        return;
      }
      const lucks = questionsData.luckCards as LuckCard[];
      const chosen = lucks[Math.floor(Math.random() * lucks.length)];
      setActiveLuck(chosen);
    }
  };

  const loadQuestionByLevel = (level: QuestionLevel) => {
    // If subject is pancasila or default, load from CURRICULUM_QUESTIONS
    let pool = CURRICULUM_QUESTIONS.filter((q) => q.level === level && !q.code?.includes('TI'));

    // Apply materi filter (A, B, C, D) if selected
    if (materiFilter && materiFilter !== 'all') {
      const filtered = pool.filter((q) => q.materiCode === materiFilter);
      if (filtered.length > 0) pool = filtered;
    }

    if (subject.id !== 'pancasila') {
      const otherQuestions = (questionsData.questions as QuestionCard[]).filter(
        (q) => q.subjectId === subject.id && q.level === level
      );
      if (otherQuestions.length > 0) pool = otherQuestions;
    }

    // Filter out already used questions in this game session if possible
    const unused = pool.filter((q) => !usedQuestionCodes.includes(q.code || q.id));
    const candidates = unused.length > 0 ? unused : pool;
    const randomQ = candidates[Math.floor(Math.random() * candidates.length)];
    if (randomQ?.code) {
      setUsedQuestionCodes((prev) => [...prev, randomQ.code!]);
    }
    setActiveQuestion(randomQ);
  };

  const loadTantanganIstimewaQuestion = () => {
    let pool = CURRICULUM_QUESTIONS.filter((q) => q.code?.includes('TI'));
    if (materiFilter && materiFilter !== 'all') {
      const filtered = pool.filter((q) => q.materiCode === materiFilter);
      if (filtered.length > 0) pool = filtered;
    }
    const unused = pool.filter((q) => !usedQuestionCodes.includes(q.code || q.id));
    const candidates = unused.length > 0 ? unused : pool;
    const randomQ = candidates[Math.floor(Math.random() * candidates.length)];
    if (randomQ?.code) {
      setUsedQuestionCodes((prev) => [...prev, randomQ.code!]);
    }
    setActiveQuestion(randomQ);
  };

  const handleSwitchLevel = (newLevel: QuestionLevel) => {
    audio.playClick();
    setSelectedQuestionLevel(newLevel);
    loadQuestionByLevel(newLevel);
    setSelectedOption('');
    setShortAnswerInput('');
    setAnswerSubmitted(false);
    setTeacherApproved(false);
  };

  // Read Aloud question
  const handleReadCardAloud = (text: string) => {
    setIsReadingAloud(true);
    speech.speak(text, () => setIsReadingAloud(false));
  };

  // Check Answer - Automatic keyword & concept check
  const handleSubmitAnswer = () => {
    if (!activeQuestion) return;

    const typed = shortAnswerInput.trim();
    if (!typed) return;

    const lowerTyped = typed.toLowerCase();
    let correct = false;

    if (activeQuestion.expectedKeywords && activeQuestion.expectedKeywords.length > 0) {
      const matchedKeywords = activeQuestion.expectedKeywords.filter((kw) =>
        lowerTyped.includes(kw.toLowerCase())
      );
      if (activeQuestion.formType === 'Jawaban singkat' || activeQuestion.type === 'short') {
        correct =
          matchedKeywords.length >= 1 ||
          lowerTyped.includes(activeQuestion.correctAnswer.toLowerCase().trim());
      } else {
        // Essay / Uraian / Matching: at least 1 keyword match or thoughtful written response
        correct = matchedKeywords.length >= 1 || typed.length >= 15;
      }
    } else {
      correct = lowerTyped.includes(activeQuestion.correctAnswer.toLowerCase().trim());
    }

    setIsAnswerCorrect(correct);
    setAnswerSubmitted(true);

    if (correct) {
      audio.playCorrect();
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
      });
      const pointsToAdd =
        activeQuestion.points ||
        (selectedQuestionLevel === 'high' ? 3 : selectedQuestionLevel === 'middle' ? 2 : 1);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === currentPlayerIndex
            ? { ...p, score: p.score + pointsToAdd, correctAnswersCount: p.correctAnswersCount + 1 }
            : p
        )
      );
    } else {
      audio.playWrong();
      // NO PENALTY! Pawn never moves backward as instructed!
    }
  };

  // Friendly Teacher / Peer manual approval for varied phrasing
  const handleTeacherApproveAnswer = () => {
    if (!activeQuestion || isAnswerCorrect) return;
    audio.playCorrect();
    setIsAnswerCorrect(true);
    setTeacherApproved(true);
    confetti({
      particleCount: 45,
      spread: 50,
      origin: { y: 0.7 },
    });
    const pointsToAdd =
      activeQuestion.points ||
      (selectedQuestionLevel === 'high' ? 3 : selectedQuestionLevel === 'middle' ? 2 : 1);
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === currentPlayerIndex
          ? { ...p, score: p.score + pointsToAdd, correctAnswersCount: p.correctAnswersCount + 1 }
          : p
      )
    );
  };

  // Submit Challenge (+2 points)
  const handleCompleteChallenge = () => {
    audio.playCorrect();
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === currentPlayerIndex
          ? { ...p, score: p.score + 2, challengesCompleted: p.challengesCompleted + 1 }
          : p
      )
    );
    closeCardAndNextTurn();
  };

  // Submit Story Card (+1 point)
  const handleCompleteStory = () => {
    audio.playCorrect();
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === currentPlayerIndex
          ? { ...p, score: p.score + 1, storiesShared: p.storiesShared + 1 }
          : p
      )
    );
    closeCardAndNextTurn();
  };

  // Apply Luck Card
  const handleApplyLuck = () => {
    if (!activeLuck) return;
    audio.playCorrect();

    if (activeLuck.actionType === 'bonus_points') {
      setPlayers((prev) =>
        prev.map((p, idx) => (idx === currentPlayerIndex ? { ...p, score: p.score + activeLuck.value } : p))
      );
      closeCardAndNextTurn();
    } else if (activeLuck.actionType === 'advance_tiles') {
      const advance = activeLuck.value;
      closeCardModal();
      hopPawnStepByStep(advance);
    } else if (activeLuck.actionType === 'roll_again') {
      closeCardModal();
      // Player keeps turn!
    } else {
      closeCardAndNextTurn();
    }
  };

  const closeCardModal = () => {
    speech.stop();
    setIsReadingAloud(false);
    setActiveCardType(null);
    setActiveQuestion(null);
    setActiveChallenge(null);
    setActiveStory(null);
    setActiveLuck(null);
  };

  const closeCardAndNextTurn = () => {
    closeCardModal();
    passToNextActivePlayer();
  };

  const passToNextActivePlayer = () => {
    let nextIdx = (currentPlayerIndex + 1) % players.length;
    let attempts = 0;
    while (players[nextIdx].isFinished && attempts < players.length) {
      nextIdx = (nextIdx + 1) % players.length;
      attempts++;
    }

    if (attempts >= players.length) {
      // Everyone finished
      handleFinalRanking();
    } else {
      setCurrentPlayerIndex(nextIdx);
    }
  };

  // Calculate final ranking
  const handleFinalRanking = () => {
    speech.stop();
    // Sort players:
    // 1. Finished players by finishRank
    // 2. Unfinished players by furthest tile, then by score
    const finished = [...players.filter((p) => p.isFinished)].sort(
      (a, b) => (a.finishRank || 99) - (b.finishRank || 99)
    );
    const unfinished = [...players.filter((p) => !p.isFinished)].sort((a, b) => {
      if (b.currentTile !== a.currentTile) {
        return b.currentTile - a.currentTile;
      }
      return b.score - a.score;
    });

    const ranked = [...finished, ...unfinished].map((p, idx) => ({
      ...p,
      finishRank: idx + 1,
    }));

    onFinishGame(ranked, elapsedSeconds);
  };

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] p-2 sm:p-4 max-w-5xl mx-auto flex flex-col justify-between select-none">
      {/* Top Bar: One score box per player + countdown/elapsed timer */}
      <div className="w-full bg-white/95 dark:bg-[#3d2e1c]/95 rounded-2xl p-2.5 sm:p-3 shadow-md border-2 border-amber-300 dark:border-amber-500/80 mb-3 flex flex-wrap items-center justify-between gap-2">
        {/* Players Score Boxes */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {players.map((player, idx) => {
            const isTurn = idx === currentPlayerIndex && !player.isFinished;
            return (
              <div
                key={player.id}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border-2 transition-all shrink-0 ${
                  isTurn
                    ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 shadow-md scale-105'
                    : 'bg-amber-50/70 dark:bg-[#4d3c26] border-amber-200 dark:border-amber-700/80'
                }`}
              >
                <CharacterAvatar
                  fileName={player.fileName}
                  name={player.nickname}
                  size="sm"
                  ringColor={player.color}
                />
                <div className="leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="font-heading font-black text-xs text-amber-950 dark:text-amber-100 truncate max-w-[80px]">
                      {player.nickname}
                    </span>
                    {player.isFinished && (
                      <span className="text-[10px] bg-emerald-500 text-white font-black px-1 rounded">
                        #{player.finishRank}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800/80 dark:text-amber-200">
                    <span className="text-amber-600 dark:text-amber-400 font-black">★ {player.score}</span>
                    <span className="text-amber-400">•</span>
                    <span>Petak {player.currentTile}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timer & Pause / Game Menu Button */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/90 dark:bg-[#4d3c26] text-amber-950 dark:text-amber-100 text-xs font-black border border-amber-300 dark:border-amber-600">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>
              {timeMode === 'unlimited' ? `Waktu: ${formatTime(elapsedSeconds)}` : `Sisa: ${formatTime(secondsLeft)}`}
            </span>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              setIsPaused(true);
            }}
            title="Jeda Permainan & Menu Pilihan"
            className="btn-chunky flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-2 border-amber-500 shadow-[0_2px_0_#d97706] active:translate-y-0.5 cursor-pointer"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Jeda</span>
          </button>
        </div>
      </div>

      {/* Main Board Container: Square Village-themed Board */}
      <div className="relative w-full aspect-square max-w-[580px] mx-auto bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 dark:from-slate-800 dark:via-slate-850 dark:to-emerald-950 rounded-3xl p-3 sm:p-4 shadow-2xl border-4 border-amber-400 dark:border-amber-600 overflow-hidden">
        {/* Village Path Illustrated Backdrop with clear winding track path connecting all tiles */}
        <div className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-45">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            {/* Winding path road background */}
            <path
              d="M 50 460 Q 250 460 450 460 Q 480 430 450 390 Q 250 390 50 390 Q 20 350 50 320 Q 250 320 450 320 Q 480 280 450 250 Q 250 250 50 250 Q 20 210 50 180 Q 250 180 450 180 Q 480 140 450 110 Q 250 110 50 110 Q 20 70 50 40 Q 250 40 460 40"
              stroke="#fbbf24"
              strokeWidth="42"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 50 460 Q 250 460 450 460 Q 480 430 450 390 Q 250 390 50 390 Q 20 350 50 320 Q 250 320 450 320 Q 480 280 450 250 Q 250 250 50 250 Q 20 210 50 180 Q 250 180 450 180 Q 480 140 450 110 Q 250 110 50 110 Q 20 70 50 40 Q 250 40 460 40"
              stroke="#fef08a"
              strokeWidth="36"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Small river */}
            <path d="M 280 0 Q 320 250 200 500" stroke="#38bdf8" strokeWidth="18" fill="none" opacity="0.6" />
          </svg>
        </div>

        {/* 50 Board Tiles */}
        {BOARD_TILES.map((tile) => {
          const meta = TILE_META[tile.type];
          const isStart = tile.number === 1;
          const isFinish = tile.number === 50;

          return (
            <div
              key={tile.number}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center font-black transition-transform cursor-pointer hover:scale-110 ${
                isStart || isFinish
                  ? 'w-10 h-10 sm:w-12 sm:h-12 border-3 border-amber-600 shadow-lg text-[10px]'
                  : 'w-6 h-6 sm:w-8 sm:h-8 border-2 border-white shadow-md text-[9px] sm:text-[11px]'
              } ${meta.bgClass}`}
              style={{ left: `${tile.x}%`, top: `${tile.y}%` }}
              onClick={() => openCardForTile(tile.type)}
              title={`Petak ${tile.number}: ${meta.name}`}
            >
              <span className="leading-none drop-shadow">{tile.number}</span>
              {isStart && <span className="text-[6px] font-black leading-none mt-0.5">START</span>}
              {isFinish && <span className="text-[6px] font-black leading-none mt-0.5">FINISH</span>}
            </div>
          );
        })}

        {/* Pawns on Board */}
        {players.map((player, idx) => {
          const tile = BOARD_TILES.find((b) => b.number === player.currentTile) || BOARD_TILES[0];
          const isTurn = idx === currentPlayerIndex;
          // Slight offset when multiple players occupy the same tile
          const offsetX = (idx % 3) * 6 - 6;
          const offsetY = Math.floor(idx / 3) * 6 - 8;

          return (
            <div
              key={player.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `calc(${tile.x}% + ${offsetX}px)`,
                top: `calc(${tile.y}% + ${offsetY}px)`,
              }}
            >
              <CharacterPawn
                fileName={player.fileName}
                name={player.nickname}
                ringColor={player.color}
                isCurrentTurn={isTurn}
                isHopping={isMovingPawn && isTurn}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Control Bar: Turn Status & Dice Roller */}
      <div className="w-full bg-white/95 dark:bg-[#3d2e1c]/95 rounded-2xl p-3 sm:p-4 shadow-xl border-2 border-amber-300 dark:border-amber-500/80 mt-3 flex items-center justify-between gap-3">
        {/* Current Turn Nickname Indicator */}
        <div className="flex items-center gap-3">
          <CharacterAvatar
            fileName={currentPlayer.fileName}
            name={currentPlayer.nickname}
            size="md"
            ringColor={currentPlayer.color}
          />
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-700 dark:text-amber-300 block">
              Giliran Pemain
            </span>
            <h3 className="font-heading font-black text-base sm:text-xl text-amber-950 dark:text-amber-100 leading-tight">
              Giliran: {currentPlayer.nickname}
            </h3>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-200/90 font-bold">
              Petak #{currentPlayer.currentTile} • Skor: {currentPlayer.score} poin
            </p>
          </div>
        </div>

        {/* Animated Authentic Dice Button with Real Pips (Dots, Not Numbers) */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            onClick={handleRollDice}
            disabled={isRolling || isMovingPawn || activeCardType !== null || currentPlayer.isFinished}
            className={`btn-chunky relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl transition-transform cursor-pointer select-none ${
              isRolling
                ? 'bg-gradient-to-br from-amber-100 to-amber-200 border-3 border-amber-500 animate-spin shadow-lg'
                : 'bg-gradient-to-b from-white via-amber-50/90 to-amber-100 border-3 border-amber-400 shadow-[0_6px_0_#d97706,0_8px_16px_rgba(217,119,6,0.3)] hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#d97706]'
            }`}
            title="Kocok Dadu Berbintik"
          >
            {/* White glossy die face inside with authentic pips */}
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-xl bg-white shadow-inner border border-amber-200/80 flex items-center justify-center">
              <DicePipsFace value={diceValue} />
            </div>
          </button>
          <span className="text-[10px] font-black text-amber-900 dark:text-amber-200">
            {isRolling ? 'Mengocok...' : 'Kocok Dadu!'}
          </span>
        </div>
      </div>

      {/* Tappable Deck Area for Each Card Type */}
      <div className="w-full mt-2.5 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
        {[
          { type: 'low' as TileType, label: 'Soal Low', color: 'bg-emerald-500 text-white' },
          { type: 'middle' as TileType, label: 'Soal Middle', color: 'bg-amber-400 text-amber-950' },
          { type: 'high' as TileType, label: 'Soal High', color: 'bg-rose-500 text-white' },
          { type: 'science' as TileType, label: 'Ilmu 💡', color: 'bg-sky-500 text-white' },
          { type: 'fun' as TileType, label: 'Seru 🎵', color: 'bg-pink-500 text-white' },
          { type: 'story' as TileType, label: 'Cerita 🗺️', color: 'bg-teal-500 text-white' },
          { type: 'luck' as TileType, label: 'Bintang ⭐', color: 'bg-purple-500 text-white' },
        ].map((deck) => (
          <button
            key={deck.type}
            onClick={() => openCardForTile(deck.type)}
            className={`btn-chunky px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-heading font-black shadow-sm shrink-0 border border-white/50 ${deck.color}`}
          >
            {deck.label}
          </button>
        ))}
      </div>

      {/* CARD MODAL (Questions, Challenges, Story, Luck) - Warm Rural Bamboo / Clay Parchment Theme */}
      {activeCardType !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-gradient-to-b from-[#fffef5] via-[#fef9eb] to-[#fef3c7] dark:bg-gradient-to-b dark:from-[#3a2d1d] dark:via-[#423420] dark:to-[#2e2316] rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-amber-400 dark:border-amber-500 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CharacterAvatar
                  fileName={currentPlayer.fileName}
                  name={currentPlayer.nickname}
                  size="sm"
                  ringColor={currentPlayer.color}
                />
                <span className="font-heading font-black text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                  Giliran: {currentPlayer.nickname}
                </span>
              </div>

              {/* Baca Nyaring Button (Indonesian Speech Synthesis) */}
              <button
                onClick={() => {
                  const textToRead =
                    activeQuestion?.question ||
                    activeChallenge?.task ||
                    activeStory?.prompt ||
                    activeLuck?.description ||
                    '';
                  handleReadCardAloud(textToRead);
                }}
                className={`btn-chunky inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black border ${
                  isReadingAloud
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Baca Nyaring</span>
              </button>
            </div>

            {/* A. CURRICULUM QUESTION & TANTANGAN ISTIMEWA CARD (All Typed Answers) */}
            {activeQuestion && (
              <div>
                {/* Level Switcher (Only on question tiles low, middle, high) */}
                {(activeCardType === 'low' || activeCardType === 'middle' || activeCardType === 'high') && (
                  <div className="flex items-center justify-between mb-3 bg-amber-100/80 dark:bg-[#4a3b26] p-1.5 rounded-2xl border border-amber-300/80 dark:border-amber-700/80">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-200 pl-2">
                      Tingkat Soal:
                    </span>
                    <div className="flex gap-1">
                      {[
                        { id: 'low' as QuestionLevel, label: 'Mudah (1 Poin)', color: 'bg-emerald-500' },
                        { id: 'middle' as QuestionLevel, label: 'Sedang (2 Poin)', color: 'bg-amber-500' },
                        { id: 'high' as QuestionLevel, label: 'Sulit (3 Poin)', color: 'bg-rose-500' },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          disabled={answerSubmitted}
                          onClick={() => handleSwitchLevel(lvl.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-heading font-black transition-all ${
                            selectedQuestionLevel === lvl.id
                              ? `${lvl.color} text-white shadow-xs`
                              : 'text-amber-800 dark:text-amber-200 hover:text-amber-950'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question Info Header Badges: Kode Soal, Materi, Indikator, Bentuk Soal */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  {activeQuestion.code && (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-white font-mono font-black text-xs shadow-xs tracking-wider">
                      Kode: {activeQuestion.code}
                    </span>
                  )}
                  {activeQuestion.materiName && (
                    <span className="px-2.5 py-1 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200 font-bold text-[11px] border border-orange-300 dark:border-orange-700">
                      Materi {activeQuestion.materiCode ? `${activeQuestion.materiCode}: ` : ''}{activeQuestion.materiName}
                    </span>
                  )}
                  {activeQuestion.indicator && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-200/80 dark:bg-[#57442a] text-amber-900 dark:text-amber-200 font-bold text-[10px]">
                      Indikator: {activeQuestion.indicator}
                    </span>
                  )}
                  {activeQuestion.formType && (
                    <span className="px-2 py-0.5 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 font-bold text-[10px] border border-teal-300 dark:border-teal-700">
                      Bentuk: {activeQuestion.formType}
                    </span>
                  )}
                  <span className="ml-auto px-2.5 py-1 rounded-xl bg-emerald-500 text-white font-black text-xs shadow-xs">
                    +{activeQuestion.points} Poin
                  </span>
                </div>

                {/* Question Text */}
                <div className="bg-white/95 dark:bg-[#4d3c26] p-4 sm:p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-600 mb-4 shadow-sm">
                  <p className="font-heading font-black text-base sm:text-lg text-amber-950 dark:text-amber-100 leading-snug">
                    {activeQuestion.question}
                  </p>
                </div>

                {/* Answer Inputs (Must Be Typed - No Oral Answers!) */}
                {!answerSubmitted ? (
                  <div>
                    <label className="block text-xs font-black text-amber-900 dark:text-amber-200 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>✏️</span>
                        <span>Ketik Jawabanmu di Bawah:</span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                        {shortAnswerInput.trim().length} karakter
                      </span>
                    </label>

                    {activeQuestion.formType === 'Jawaban singkat' || activeQuestion.type === 'short' ? (
                      <input
                        type="text"
                        autoFocus
                        value={shortAnswerInput}
                        onChange={(e) => setShortAnswerInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && shortAnswerInput.trim()) {
                            handleSubmitAnswer();
                          }
                        }}
                        placeholder="Ketik jawaban singkatmu di sini..."
                        className="w-full p-3.5 rounded-2xl border-2 border-amber-400 dark:border-amber-600 bg-white dark:bg-[#524129] font-black text-sm text-amber-950 dark:text-amber-100 placeholder-amber-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-300 focus:outline-none shadow-inner mb-4"
                      />
                    ) : (
                      <textarea
                        autoFocus
                        rows={3}
                        value={shortAnswerInput}
                        onChange={(e) => setShortAnswerInput(e.target.value)}
                        placeholder="Ketik uraian jawabanmu dengan rapi di sini..."
                        className="w-full p-3.5 rounded-2xl border-2 border-amber-400 dark:border-amber-600 bg-white dark:bg-[#524129] font-bold text-sm text-amber-950 dark:text-amber-100 placeholder-amber-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-300 focus:outline-none shadow-inner mb-4 resize-none"
                      />
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!shortAnswerInput.trim()}
                      className="btn-chunky w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-white font-heading font-black text-base shadow-[0_5px_0_#b45309] border border-amber-300 cursor-pointer transition-all"
                    >
                      Kirim Jawaban! 🚀
                    </button>
                  </div>
                ) : (
                  /* Answer Feedback */
                  <div className="text-center">
                    {isAnswerCorrect ? (
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 text-emerald-900 dark:text-emerald-200 mb-4 animate-bounce">
                        <span className="text-3xl">🎉</span>
                        <h4 className="font-heading font-black text-lg text-emerald-700 dark:text-emerald-300 mt-1">
                          Hebat Sekali! Jawaban Tepat!
                        </h4>
                        <p className="text-xs sm:text-sm font-bold mt-1">
                          +{activeQuestion.points} Poin berhasil didapatkan!
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 text-amber-900 dark:text-amber-200 mb-3 animate-wobble">
                        <span className="text-3xl">🤗</span>
                        <h4 className="font-heading font-black text-lg text-amber-700 dark:text-amber-300 mt-1">
                          Usaha yang Bagus! Tetap Semangat!
                        </h4>
                        <p className="text-xs sm:text-sm font-medium mt-1">
                          Ayo pelajari kunci jawaban panduan di bawah untuk menambah pemahamanmu.
                        </p>
                        {/* Friendly Teacher / Peer Override Button */}
                        {!teacherApproved && (
                          <button
                            type="button"
                            onClick={handleTeacherApproveAnswer}
                            className="btn-chunky mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-xs cursor-pointer border border-emerald-300"
                          >
                            <span>✅ Disetujui Guru / Teman (+{activeQuestion.points} Poin)</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* What user typed */}
                    <div className="p-3 rounded-xl bg-amber-100/70 dark:bg-[#433420] text-xs text-amber-950 dark:text-amber-100 text-left mb-2.5 border border-amber-200 dark:border-amber-700">
                      <span className="font-black text-amber-800 dark:text-amber-300 block mb-0.5">
                        ✍️ Jawaban yang Kamu Ketik:
                      </span>
                      <p className="italic font-bold">"{shortAnswerInput}"</p>
                    </div>

                    {/* Official Model Answer (Kunci Jawaban) */}
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-xs text-emerald-950 dark:text-emerald-100 text-left mb-2.5 border border-emerald-300 dark:border-emerald-700">
                      <span className="font-black text-emerald-800 dark:text-emerald-300 block mb-0.5">
                        📖 Kunci Jawaban Panduan:
                      </span>
                      <p className="font-bold">{activeQuestion.correctAnswer}</p>
                    </div>

                    {/* Friendly Explanation */}
                    <div className="p-3 rounded-xl bg-white/90 dark:bg-[#4d3c26] text-xs text-amber-950 dark:text-amber-100 text-left mb-4 border border-amber-200 dark:border-amber-600">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">💡 Penjelasan Materi:</strong>
                      <p>{activeQuestion.explanation}</p>
                    </div>

                    <button
                      onClick={closeCardAndNextTurn}
                      className="btn-chunky w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-base shadow-[0_5px_0_#059669] border border-emerald-300 cursor-pointer"
                    >
                      Lanjut Giliran Berikutnya →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* D. LUCK CARD (Bintang Keberuntungan) */}
            {activeLuck && (
              <div className="text-center">
                <span className="text-4xl animate-bounce">⭐</span>
                <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-300 block mt-2">
                  Kartu Keberuntungan
                </span>
                <h3 className="font-heading font-black text-xl text-amber-950 dark:text-amber-100 mt-1 mb-2">
                  {activeLuck.title}
                </h3>
                <p className="text-sm sm:text-base text-amber-950 dark:text-amber-100 font-bold mb-5 p-4 bg-white/95 dark:bg-[#4d3c26] rounded-2xl border-2 border-purple-300 dark:border-purple-600 shadow-sm">
                  {activeLuck.description}
                </p>
                <button
                  onClick={handleApplyLuck}
                  className="btn-chunky w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-heading font-black text-base shadow-[0_5px_0_#7e22ce] border border-purple-300 cursor-pointer"
                >
                  Ambil Hadiah Keberuntungan! 🌟
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL MENU PERMAINAN KETIKA DIJEDA (Pause Menu) */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#fffef5] via-[#fef9eb] to-[#fef3c7] dark:bg-gradient-to-b dark:from-[#3a2d1d] dark:via-[#423420] dark:to-[#2e2316] rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-amber-400 dark:border-amber-500 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-[#4d3c26] text-amber-700 dark:text-amber-300 flex items-center justify-center text-3xl mb-3 shadow-inner border-2 border-amber-300 dark:border-amber-600">
              ⏸️
            </div>

            <h3 className="font-heading font-black text-2xl sm:text-3xl text-amber-950 dark:text-amber-100 mb-1">
              Permainan Dijeda
            </h3>
            <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-200/90 font-bold mb-6">
              Permainan sedang dihentikan sementara. Silakan pilih opsi di bawah:
            </p>

            <div className="flex flex-col gap-3 w-full">
              {/* 1. Lanjutkan Bermain */}
              <button
                onClick={() => {
                  audio.playClick();
                  setIsPaused(false);
                }}
                className="btn-chunky flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-base shadow-[0_5px_0_#065f46] border border-emerald-300 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Lanjutkan Bermain</span>
              </button>

              {/* 2. Akhiri Permainan dan Lihat Juara */}
              <button
                onClick={() => {
                  audio.playClick();
                  setIsPaused(false);
                  handleFinalRanking();
                }}
                className="btn-chunky flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-heading font-black text-base shadow-[0_5px_0_#b45309] border border-amber-300 cursor-pointer"
              >
                <Trophy className="w-5 h-5" />
                <span>Akhiri Permainan & Lihat Juara</span>
              </button>

              {/* 3. Kembali ke Menu Utama */}
              <button
                onClick={() => {
                  audio.playClick();
                  setIsPaused(false);
                  onNavigateHome();
                }}
                className="btn-chunky flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl bg-amber-100 dark:bg-[#4d3c26] hover:bg-amber-200 dark:hover:bg-[#5a462d] text-amber-950 dark:text-amber-100 font-heading font-black text-base shadow-[0_3px_0_#d97706] border-2 border-amber-300 dark:border-amber-600 cursor-pointer"
              >
                <Home className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                <span>Kembali ke Menu Utama</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
