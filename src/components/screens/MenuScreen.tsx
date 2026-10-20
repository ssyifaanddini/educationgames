import React from 'react';
import { BookOpen, Users, Sparkles } from 'lucide-react';
import { audio } from '../../utils/audio';

interface MenuScreenProps {
  onNavigateTutorial: () => void;
  onNavigatePlay: () => void;
  onNavigateHome: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onNavigateTutorial,
  onNavigatePlay,
  onNavigateHome,
}) => {
  const handleTutorial = () => {
    audio.playClick();
    onNavigateTutorial();
  };

  const handlePlay = () => {
    audio.playClick();
    onNavigatePlay();
  };

  const handleHome = () => {
    audio.playClick();
    onNavigateHome();
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
      {/* Welcome Card Panel */}
      <div className="w-full bg-gradient-to-b from-white/95 via-[#fefbf0]/95 to-[#fef3c7]/95 dark:bg-gradient-to-b dark:from-[#3a2d1d]/95 dark:via-[#423420]/95 dark:to-[#2e2316]/95 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 dark:border-amber-500 text-center backdrop-blur-md">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-[#4d3c26] text-amber-900 dark:text-amber-200 text-xs font-black mb-4 border border-amber-300 dark:border-amber-600">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Selamat Datang di Dunia GAMBRENG!</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-100 mb-2 leading-tight">
          Pilih Aksimu Hari Ini!
        </h2>
        <p className="text-sm sm:text-base text-amber-800/90 dark:text-amber-200/90 mb-8 font-bold">
          Ayo belajar bersama Maria, Andi, Boris, Ajeng, dan Lestari mengelilingi desa menuju sekolah!
        </p>

        {/* Two Large Icon Buttons */}
        <div className="flex flex-col gap-5 w-full">
          {/* Button 1: Ayo Main Bareng (Primary) */}
          <button
            onClick={handlePlay}
            className="btn-chunky group relative flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-xl sm:text-2xl p-5 rounded-3xl shadow-[0_8px_0_#065f46] border-2 border-emerald-300 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner text-3xl group-hover:scale-110 transition-transform">
                🎲
              </div>
              <div>
                <span className="block leading-tight">Ayo Main Bareng</span>
                <span className="block text-xs sm:text-sm font-sans font-bold text-emerald-100 opacity-90 mt-0.5">
                  Mulai petualangan papan & tantangan seru
                </span>
              </div>
            </div>
            <Users className="w-7 h-7 text-emerald-100 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Button 2: Petunjuk Permainan (Secondary) */}
          <button
            onClick={handleTutorial}
            className="btn-chunky group relative flex items-center justify-between bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-heading font-black text-xl sm:text-2xl p-5 rounded-3xl shadow-[0_8px_0_#b45309] border-2 border-amber-200 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/30 flex items-center justify-center shadow-inner text-3xl group-hover:scale-110 transition-transform">
                📖
              </div>
              <div>
                <span className="block leading-tight">Petunjuk Permainan</span>
                <span className="block text-xs sm:text-sm font-sans font-bold text-amber-900/80 mt-0.5">
                  Cara kocok dadu, kartu soal & aturan seru
                </span>
              </div>
            </div>
            <BookOpen className="w-7 h-7 text-amber-900 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Button 3: Kembali ke Halaman Beranda */}
          <button
            onClick={handleHome}
            className="w-full py-2.5 text-center text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            ← Kembali ke Halaman Beranda
          </button>
        </div>
      </div>
    </div>
  );
};
