import React, { useState } from 'react';
import { Subject, Player, TimeMode } from '../../types/game';
import { CHARACTERS } from '../../data/characters';
import { getCharacterVisual } from '../../data/characterVisuals';
import { CharacterAvatar } from '../common/CharacterAvatar';
import { audio } from '../../utils/audio';
import { Users, Clock, Sparkles, Plus, Trash2, ArrowLeft, Play, UserCheck, Star, Trophy } from 'lucide-react';

interface GameSetupScreenProps {
  subject: Subject;
  onBack: () => void;
  onStartGame: (players: Player[], timeMode: TimeMode, enableLuckCards: boolean, materiFilter: string) => void;
}

interface PlayerDraft {
  characterId: string;
  nickname: string;
  ringColor: string;
}

// Playful, vibrant themes for up to 5 players (No harsh black or dull grays)
const PLAYER_THEMES = [
  {
    label: 'Pemain 1',
    badge: '1️⃣ Merah Ceria',
    ringColor: '#ef4444',
    bgCard: 'bg-gradient-to-br from-rose-50 via-red-50/80 to-amber-50 dark:from-rose-950/40 dark:via-red-950/30 dark:to-slate-900',
    border: 'border-rose-300 dark:border-rose-700/60',
    accentText: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-gradient-to-r from-rose-500 to-red-500 shadow-[0_2px_0_#9f1239]',
    inputBorder: 'border-rose-200 focus:border-rose-400 focus:ring-rose-200 dark:border-rose-800 dark:focus:border-rose-400',
    subText: 'text-rose-600/80 dark:text-rose-400',
  },
  {
    label: 'Pemain 2',
    badge: '2️⃣ Biru Langit',
    ringColor: '#3b82f6',
    bgCard: 'bg-gradient-to-br from-sky-50 via-blue-50/80 to-cyan-50 dark:from-sky-950/40 dark:via-blue-950/30 dark:to-slate-900',
    border: 'border-sky-300 dark:border-sky-700/60',
    accentText: 'text-sky-700 dark:text-sky-300',
    badgeBg: 'bg-gradient-to-r from-sky-500 to-blue-500 shadow-[0_2px_0_#0369a1]',
    inputBorder: 'border-sky-200 focus:border-sky-400 focus:ring-sky-200 dark:border-sky-800 dark:focus:border-sky-400',
    subText: 'text-sky-600/80 dark:text-sky-400',
  },
  {
    label: 'Pemain 3',
    badge: '3️⃣ Hijau Segar',
    ringColor: '#10b981',
    bgCard: 'bg-gradient-to-br from-emerald-50 via-teal-50/80 to-green-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900',
    border: 'border-emerald-300 dark:border-emerald-700/60',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_2px_0_#047857]',
    inputBorder: 'border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 dark:border-emerald-800 dark:focus:border-emerald-400',
    subText: 'text-emerald-600/80 dark:text-emerald-400',
  },
  {
    label: 'Pemain 4',
    badge: '4️⃣ Kuning Mentari',
    ringColor: '#f59e0b',
    bgCard: 'bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-slate-900',
    border: 'border-amber-300 dark:border-amber-700/60',
    accentText: 'text-amber-800 dark:text-amber-300',
    badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_2px_0_#b45309]',
    inputBorder: 'border-amber-200 focus:border-amber-400 focus:ring-amber-200 dark:border-amber-800 dark:focus:border-amber-400',
    subText: 'text-amber-700/80 dark:text-amber-400',
  },
  {
    label: 'Pemain 5',
    badge: '5️⃣ Ungu Bintang',
    ringColor: '#8b5cf6',
    bgCard: 'bg-gradient-to-br from-purple-50 via-fuchsia-50/80 to-pink-50 dark:from-purple-950/40 dark:via-violet-950/30 dark:to-slate-900',
    border: 'border-purple-300 dark:border-purple-700/60',
    accentText: 'text-purple-700 dark:text-purple-300',
    badgeBg: 'bg-gradient-to-r from-purple-500 to-violet-500 shadow-[0_2px_0_#6b21a8]',
    inputBorder: 'border-purple-200 focus:border-purple-400 focus:ring-purple-200 dark:border-purple-800 dark:focus:border-purple-400',
    subText: 'text-purple-600/80 dark:text-purple-400',
  },
];

// Playful player count options
const PLAYER_COUNT_OPTIONS = [
  { count: 1, label: '1 Anak', subtitle: 'Solo', icon: '🎯', activeColor: 'from-rose-500 to-red-500 shadow-[0_4px_0_#9f1239]' },
  { count: 2, label: '2 Anak', subtitle: 'Duel Seru', icon: '⚔️', activeColor: 'from-sky-500 to-blue-500 shadow-[0_4px_0_#0369a1]' },
  { count: 3, label: '3 Anak', subtitle: 'Trio Ceria', icon: '🎪', activeColor: 'from-emerald-500 to-teal-500 shadow-[0_4px_0_#047857]' },
  { count: 4, label: '4 Anak', subtitle: 'Regu Kompak', icon: '🚀', activeColor: 'from-amber-500 to-orange-500 shadow-[0_4px_0_#b45309]' },
  { count: 5, label: '5 Anak', subtitle: 'Pesta Kelas', icon: '🌟', activeColor: 'from-purple-500 to-fuchsia-500 shadow-[0_4px_0_#6b21a8]' },
];

export const GameSetupScreen: React.FC<GameSetupScreenProps> = ({
  subject,
  onBack,
  onStartGame,
}) => {
  // 1 to 5 players
  const [playerDrafts, setPlayerDrafts] = useState<PlayerDraft[]>([
    { characterId: 'maria', nickname: '', ringColor: PLAYER_THEMES[0].ringColor },
    { characterId: 'andi', nickname: '', ringColor: PLAYER_THEMES[1].ringColor },
  ]);

  const [timeMode, setTimeMode] = useState<TimeMode>('30m');
  const [enableLuckCards, setEnableLuckCards] = useState<boolean>(true);
  const [selectedMateri, setSelectedMateri] = useState<string>('all');

  // Characters already chosen by any player
  const chosenCharacterIds = playerDrafts.map((p) => p.characterId);

  // Set specific player count directly from playful buttons (1 - 5)
  const handleSelectPlayerCount = (targetCount: number) => {
    audio.playClick();
    if (targetCount === playerDrafts.length) return;

    if (targetCount < playerDrafts.length) {
      // Shrink
      setPlayerDrafts((prev) => prev.slice(0, targetCount));
    } else {
      // Expand up to targetCount
      setPlayerDrafts((prev) => {
        const nextDrafts = [...prev];
        while (nextDrafts.length < targetCount) {
          const currentChosen = nextDrafts.map((d) => d.characterId);
          const available = CHARACTERS.find((c) => !currentChosen.includes(c.id)) || CHARACTERS[nextDrafts.length % CHARACTERS.length];
          const themeIndex = nextDrafts.length % PLAYER_THEMES.length;
          nextDrafts.push({
            characterId: available.id,
            nickname: '',
            ringColor: PLAYER_THEMES[themeIndex].ringColor,
          });
        }
        return nextDrafts;
      });
    }
  };

  const handleAddPlayer = () => {
    if (playerDrafts.length >= 5) return;
    audio.playClick();
    const availableChar = CHARACTERS.find((c) => !chosenCharacterIds.includes(c.id));
    if (availableChar) {
      const themeIndex = playerDrafts.length % PLAYER_THEMES.length;
      setPlayerDrafts((prev) => [
        ...prev,
        {
          characterId: availableChar.id,
          nickname: '',
          ringColor: PLAYER_THEMES[themeIndex].ringColor,
        },
      ]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerDrafts.length <= 1) return;
    audio.playClick();
    setPlayerDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCharacterChange = (playerIndex: number, newCharId: string) => {
    audio.playClick();
    setPlayerDrafts((prev) =>
      prev.map((draft, idx) => (idx === playerIndex ? { ...draft, characterId: newCharId } : draft))
    );
  };

  const handleNicknameChange = (playerIndex: number, text: string) => {
    const trimmed = text.slice(0, 12);
    setPlayerDrafts((prev) =>
      prev.map((draft, idx) => (idx === playerIndex ? { ...draft, nickname: trimmed } : draft))
    );
  };

  const handleStart = () => {
    audio.playClick();
    const finalPlayers: Player[] = playerDrafts.map((draft, idx) => {
      const charDef = CHARACTERS.find((c) => c.id === draft.characterId) || CHARACTERS[0];
      const trimmedNickname = draft.nickname.trim();
      const finalNickname = trimmedNickname.length > 0 ? trimmedNickname : charDef.name;

      return {
        id: `player-${idx + 1}`,
        characterId: charDef.id,
        characterName: charDef.name,
        nickname: finalNickname,
        fileName: charDef.fileName,
        color: draft.ringColor,
        currentTile: 1, // Start at tile 1 (RUMAH - START)
        score: 0,
        isFinished: false,
        challengesCompleted: 0,
        storiesShared: 0,
        correctAnswersCount: 0,
      };
    });

    onStartGame(finalPlayers, timeMode, enableLuckCards, selectedMateri);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] p-3 sm:p-4 max-w-2xl mx-auto pb-12">
      {/* Playful Colorful Card Container */}
      <div className="bg-gradient-to-b from-amber-50/95 via-yellow-50/90 to-orange-50/95 dark:from-indigo-950/95 dark:via-purple-950/90 dark:to-slate-900/95 rounded-3xl p-5 sm:p-8 shadow-[0_12px_36px_rgba(245,158,11,0.25)] border-4 border-amber-400 dark:border-amber-400/80 backdrop-blur-md">
        
        {/* Navigation & Subject Banner */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              audio.playClick();
              onBack();
            }}
            className="btn-chunky inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-amber-900 dark:text-amber-200 font-extrabold text-xs border-2 border-amber-200 dark:border-amber-800 hover:bg-amber-100 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>Ganti Pilihan</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 font-black text-xs shadow-[0_2px_0_#b45309] border border-amber-300">
            <span className="text-sm">{subject.icon}</span>
            <span>{subject.name}</span>
          </span>
        </div>

        {/* Playful Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-black uppercase tracking-wider mb-1.5 border border-orange-200 dark:border-orange-800">
            <span>🎲 Petualangan Papan SD</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-200 tracking-wide drop-shadow-xs">
            Siapkan Regu Bermain!
          </h2>
          <p className="text-xs sm:text-sm text-amber-800/80 dark:text-amber-300/80 font-bold mt-1">
            Tentukan jumlah anak, pilih karakter kesukaan, dan atur waktu main yang seru!
          </p>
        </div>

        {/* Section 1: Playful Player Count Selector (Jumlah Pemain) */}
        <div className="mb-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/70 border-3 border-amber-300 dark:border-amber-600/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-base shadow-inner">
                👥
              </span>
              <div>
                <h3 className="font-heading font-black text-sm sm:text-base text-amber-950 dark:text-amber-200">
                  Pilih Jumlah Pemain:
                </h3>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  Saat ini: <strong className="text-amber-900 dark:text-amber-100 font-black">{playerDrafts.length} Anak</strong> bermain bersama
                </span>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300">
              Maks. 5
            </span>
          </div>

          {/* Chunky Toy Selector Buttons for Player Count */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {PLAYER_COUNT_OPTIONS.map((opt) => {
              const isSelected = playerDrafts.length === opt.count;
              return (
                <button
                  key={opt.count}
                  type="button"
                  onClick={() => handleSelectPlayerCount(opt.count)}
                  className={`btn-chunky flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-b ${opt.activeColor} text-white border-white scale-105 ring-3 ring-amber-300 z-10`
                      : 'bg-amber-50/70 dark:bg-slate-700/60 hover:bg-amber-100 border-amber-200 dark:border-slate-600 text-amber-900 dark:text-amber-200 shadow-[0_2px_0_rgba(217,119,6,0.2)]'
                  }`}
                >
                  <span className="text-lg sm:text-xl drop-shadow-xs">{opt.icon}</span>
                  <span className="font-heading font-black text-xs sm:text-sm leading-tight mt-0.5">
                    {opt.count}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold leading-tight ${isSelected ? 'text-white/90' : 'text-amber-700 dark:text-amber-400'}`}>
                    {opt.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Player Customization Cards (Vibrant & Playful) */}
        <div className="space-y-4 mb-6">
          {playerDrafts.map((draft, playerIndex) => {
            const currentChar = CHARACTERS.find((c) => c.id === draft.characterId) || CHARACTERS[0];
            const theme = PLAYER_THEMES[playerIndex % PLAYER_THEMES.length];

            return (
              <div
                key={playerIndex}
                className={`${theme.bgCard} p-4 sm:p-5 rounded-2xl border-3 ${theme.border} shadow-md transition-all`}
              >
                {/* Player Card Header */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-amber-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <CharacterAvatar
                      fileName={currentChar.fileName}
                      name={draft.nickname || currentChar.name}
                      size="sm"
                      ringColor={theme.ringColor}
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black text-white ${theme.badgeBg}`}>
                          {theme.label}
                        </span>
                        <span className="font-heading font-black text-sm text-amber-950 dark:text-amber-100">
                          {currentChar.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-white/80 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-slate-700">
                          Suku {currentChar.origin}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold block mt-0.5 ${theme.subText}`}>
                        {draft.nickname ? `Nama di papan: "${draft.nickname}"` : 'Ketik nama panggilan di bawah agar makin seru!'}
                      </span>
                    </div>
                  </div>

                  {/* Remove player icon if more than 1 player */}
                  {playerDrafts.length > 1 && (
                    <button
                      onClick={() => handleRemovePlayer(playerIndex)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100/70 dark:hover:bg-rose-950/60 rounded-xl transition-colors border border-rose-200 dark:border-rose-900"
                      title="Hapus pemain ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Nickname Input & Character Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                  {/* Nickname Input with Fun Bubble Styling */}
                  <div className="bg-white/80 dark:bg-[#4d3c26]/90 p-3 rounded-2xl border-2 border-amber-200 dark:border-amber-600">
                    <label className="block text-xs font-black text-amber-900 dark:text-amber-200 mb-1.5">
                      ✏️ Nama Panggilan:
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={draft.nickname}
                      onChange={(e) => handleNicknameChange(playerIndex, e.target.value)}
                      placeholder={currentChar.name}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-amber-50/50 dark:bg-[#3d2e1c] border-2 ${theme.inputBorder} font-black text-sm text-amber-950 dark:text-amber-100 placeholder-amber-400 focus:bg-white focus:outline-none transition-all shadow-inner`}
                    />
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-1.5">
                      <span>💡 Maksimal 12 huruf</span>
                      <span>{draft.nickname.length}/12</span>
                    </div>
                  </div>

                  {/* Character Picker with Colorful Cards */}
                  <div className="bg-white/80 dark:bg-[#4d3c26]/90 p-3 rounded-2xl border-2 border-amber-200 dark:border-amber-600">
                    <label className="block text-xs font-black text-amber-900 dark:text-amber-200 mb-1.5">
                      🎭 Pilih Karakter Bidak:
                    </label>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {CHARACTERS.map((char) => {
                        const isChosenByOther =
                          chosenCharacterIds.includes(char.id) && draft.characterId !== char.id;
                        const isSelected = draft.characterId === char.id;

                        return (
                          <button
                            key={char.id}
                            type="button"
                            disabled={isChosenByOther}
                            onClick={() => handleCharacterChange(playerIndex, char.id)}
                            className={`relative flex flex-col items-center p-1.5 rounded-xl border-2 transition-all shrink-0 cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-b from-amber-200 to-yellow-300 border-amber-500 shadow-[0_4px_0_#d97706] scale-105 ring-2 ring-amber-400'
                                : isChosenByOther
                                ? 'opacity-40 cursor-not-allowed bg-amber-100/40 dark:bg-[#3d2e1c] border-dashed border-amber-300'
                                : 'bg-amber-50/60 dark:bg-[#3d2e1c] border-amber-200 dark:border-amber-700 hover:border-amber-400 hover:bg-amber-100/50 shadow-[0_2px_0_rgba(217,119,6,0.15)]'
                            }`}
                          >
                            {/* Uniform Character Image */}
                            <div className="h-14 sm:h-15 w-12 sm:w-13 flex items-end justify-center overflow-visible">
                              {(() => {
                                const visual = getCharacterVisual(char.fileName);
                                return (
                                  <img
                                    src={`/${char.fileName}`}
                                    alt={char.name}
                                    className="h-full w-auto max-w-none object-contain object-bottom origin-bottom transition-transform"
                                    style={{
                                      transform: `scale(${visual.standingScale}) translate(${visual.standingTranslateX}, ${visual.standingTranslateY})`,
                                    }}
                                    onError={(e) => {
                                      const img = e.currentTarget;
                                      if (!img.src.includes('src/assets/images')) {
                                        img.src = `/src/assets/images/${char.fileName}`;
                                      }
                                    }}
                                  />
                                );
                              })()}
                            </div>

                            <span className="text-[10px] font-black text-amber-950 dark:text-amber-100 mt-0.5">
                              {char.name}
                            </span>
                            <span className="text-[8px] font-extrabold text-amber-700 dark:text-amber-300">
                              {isChosenByOther ? 'Sudah Dipilih' : char.origin}
                            </span>

                            {isSelected && (
                              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                                <Star className="w-2.5 h-2.5 fill-current" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Add Player Button if less than 5 */}
        {playerDrafts.length < 5 && (
          <button
            onClick={handleAddPlayer}
            className="btn-chunky w-full py-3 px-4 mb-6 rounded-2xl border-3 border-dashed border-amber-400 dark:border-amber-500 bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-[0_3px_0_#d97706]"
          >
            <Plus className="w-5 h-5 text-amber-700 stroke-[3]" />
            <span>Tambah Pemain Tambahan ({playerDrafts.length}/5)</span>
          </button>
        )}

        {/* Section: Materi Soal Pembelajaran (A, B, C, D atau Semua 70 Soal) */}
        <div className="mb-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/70 border-3 border-amber-300 dark:border-amber-600/60 shadow-sm">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200 mb-2.5">
            <span className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center text-sm shadow-inner">
              📚
            </span>
            <span>Pilihan Materi Soal yang Dimainkan:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'all', code: 'A-D', label: 'Semua Materi (70 Soal Lengkap)', desc: 'Materi A, B, C, & D dari buku panduan' },
              { id: 'A', code: 'Materi A', label: 'A: Identitas Masyarakat', desc: '15 soal (A-L01 s.d. A-TI02)' },
              { id: 'B', code: 'Materi B', label: 'B: Menghargai Perbedaan', desc: '18 soal (B-L01 s.d. B-TI03)' },
              { id: 'C', code: 'Materi C', label: 'C: Perangkat Desa & Kelurahan', desc: '18 soal (C-L01 s.d. C-TI03)' },
              { id: 'D', code: 'Materi D', label: 'D: Menjelajah Lingkungan', desc: '19 soal (D-L01 s.d. D-TI02)' },
            ].map((mat) => {
              const isSelected = selectedMateri === mat.id;
              return (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedMateri(mat.id);
                  }}
                  className={`btn-chunky p-2.5 rounded-xl text-left border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-[0_3px_0_#d97706] font-black'
                      : 'bg-amber-50/80 dark:bg-slate-700/60 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-slate-600 hover:bg-amber-100 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-black">{mat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${isSelected ? 'bg-amber-600 text-white' : 'bg-amber-200/80 dark:bg-amber-900/50'}`}>
                      {mat.code}
                    </span>
                  </div>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-amber-950 font-bold' : 'text-amber-700/80 dark:text-amber-300'}`}>
                    {mat.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Time Mode Selection (Chunky Colorful Buttons) */}
        <div className="mb-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/70 border-3 border-amber-300 dark:border-amber-600/60 shadow-sm">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200 mb-2.5">
            <span className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center text-sm shadow-inner">
              ⏰
            </span>
            <span>Batas Waktu Bermain:</span>
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { id: '30m', label: '30 Menit', hint: 'Santai & Seru', activeStyle: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-[0_4px_0_#0f766e] border-teal-300' },
              { id: '60m', label: '60 Menit', hint: 'Petualangan Penuh', activeStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_4px_0_#b45309] border-amber-300' },
              { id: 'unlimited', label: 'Tanpa Batas', hint: 'Bebas Sampai Finis', activeStyle: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_4px_0_#581c87] border-purple-300' },
            ].map((mode) => {
              const isSelected = timeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setTimeMode(mode.id as TimeMode);
                  }}
                  className={`btn-chunky py-3 px-2 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                    isSelected
                      ? `${mode.activeStyle} scale-[1.02]`
                      : 'bg-amber-50/80 dark:bg-slate-700/60 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-slate-600 hover:bg-amber-100 shadow-[0_2px_0_rgba(217,119,6,0.2)]'
                  }`}
                >
                  <span className="font-heading font-black text-xs sm:text-sm block">
                    {mode.label}
                  </span>
                  <span className={`text-[10px] font-bold block mt-0.5 ${isSelected ? 'text-white/90' : 'text-amber-700 dark:text-amber-400'}`}>
                    {mode.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Luck Cards Toggle (Playful Purple & Stars) */}
        <div className="mb-7 p-4 rounded-2xl bg-gradient-to-r from-purple-100 via-fuchsia-100 to-pink-100 dark:from-purple-950/70 dark:via-fuchsia-950/60 dark:to-slate-900 border-3 border-purple-300 dark:border-purple-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center text-xl shadow-[0_2px_0_#6b21a8] shrink-0">
              ⭐
            </span>
            <div>
              <span className="block text-xs sm:text-sm font-black text-purple-950 dark:text-purple-100">
                Kartu Keberuntungan (Bintang Ungu)!
              </span>
              <span className="block text-[11px] sm:text-xs text-purple-800 dark:text-purple-300 font-bold">
                Petak kejutan dengan bonus poin atau lompatan ekstra seru
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setEnableLuckCards(!enableLuckCards);
            }}
            className={`btn-chunky w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer border-2 ${
              enableLuckCards ? 'bg-purple-600 border-purple-400' : 'bg-amber-200 dark:bg-slate-700 border-amber-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform flex items-center justify-center text-[10px] ${
                enableLuckCards ? 'translate-x-6 text-purple-600' : 'translate-x-0 text-slate-400'
              }`}
            >
              {enableLuckCards ? '✨' : ''}
            </div>
          </button>
        </div>

        {/* Section 5: Big Joyful Start Game Button (3D Chunky Toy Button) */}
        <button
          onClick={handleStart}
          className="btn-chunky w-full flex items-center justify-center gap-3 py-4 sm:py-5 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-xl sm:text-2xl shadow-[0_8px_0_#065f46] border-3 border-emerald-200 transition-all cursor-pointer"
        >
          <span>Mulai Bermain Sekarang!</span>
          <span className="text-2xl">🎲</span>
        </button>
      </div>
    </div>
  );
};
