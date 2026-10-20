import React from 'react';
import { Subject } from '../../types/game';
import { audio } from '../../utils/audio';
import {
  RotateCcw,
  Compass,
  BookOpen,
  Award,
  Home,
  Sparkles,
} from 'lucide-react';

interface FinalScreenProps {
  subject: Subject;
  onPlayAgain: () => void;
  onChangeSubject: () => void;
  onViewMateri: () => void;
  onPrintCertificate: () => void;
  onBackHome: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  subject,
  onPlayAgain,
  onChangeSubject,
  onViewMateri,
  onPrintCertificate,
  onBackHome,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] p-4 max-w-lg mx-auto flex flex-col items-center justify-center pb-12 select-none">
      <div className="w-full bg-gradient-to-b from-white/95 via-amber-50/90 to-yellow-50/95 dark:bg-gradient-to-b dark:from-[#3a2d1d]/95 dark:via-[#423420]/95 dark:to-[#2e2316]/95 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 dark:border-amber-500 text-center backdrop-blur-md">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 text-xs font-black mb-3 border border-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>🌾 Permainan Selesai dengan Hebat! 🌾</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-100 mb-2 leading-tight">
          Apa yang Ingin Kamu Lakukan Sekarang?
        </h2>
        <p className="text-xs sm:text-sm text-amber-800/80 dark:text-amber-200/90 mb-6 font-bold">
          Mata pelajaran yang baru saja kamu selesaikan: <strong className="text-amber-950 dark:text-amber-100 font-black">{subject.name}</strong>.
        </p>

        {/* 5 Big Chunky Buttons */}
        <div className="flex flex-col gap-3.5 w-full">
          {/* 1. Main Lagi */}
          <button
            onClick={() => {
              audio.playClick();
              onPlayAgain();
            }}
            className="btn-chunky flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-base sm:text-lg shadow-[0_5px_0_#065f46] border border-emerald-300 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
                🎲
              </div>
              <div>
                <span className="block leading-tight">Main Lagi</span>
                <span className="text-[11px] font-sans font-bold text-emerald-100 opacity-95 block">
                  Ulangi permainan dengan regu yang sama
                </span>
              </div>
            </div>
            <RotateCcw className="w-5 h-5 text-emerald-100" />
          </button>

          {/* 2. Ganti Mapel */}
          <button
            onClick={() => {
              audio.playClick();
              onChangeSubject();
            }}
            className="btn-chunky flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-heading font-black text-base sm:text-lg shadow-[0_5px_0_#b45309] border border-amber-200 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center text-xl shadow-inner">
                🧭
              </div>
              <div>
                <span className="block leading-tight">Ganti Mapel</span>
                <span className="text-[11px] font-sans font-bold text-amber-900/90 block">
                  Coba tantangan di mata pelajaran lain
                </span>
              </div>
            </div>
            <Compass className="w-5 h-5 text-amber-900" />
          </button>

          {/* 3. Lihat Materi */}
          <button
            onClick={() => {
              audio.playClick();
              onViewMateri();
            }}
            className="btn-chunky flex items-center justify-between p-4 rounded-2xl bg-white/95 dark:bg-[#4d3c26] hover:bg-amber-50 text-amber-950 dark:text-amber-100 font-heading font-black text-base shadow-[0_4px_0_#d97706] border-2 border-amber-300 dark:border-amber-600 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-[#3d2e1c] flex items-center justify-center text-xl text-amber-700 dark:text-amber-300">
                📚
              </div>
              <div>
                <span className="block leading-tight">Lihat Materi</span>
                <span className="text-[11px] font-sans font-bold text-amber-800/80 dark:text-amber-200/90 block">
                  Baca kembali rangkuman konsep & cerita
                </span>
              </div>
            </div>
            <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-300" />
          </button>

          {/* 4. Cetak Sertifikat */}
          <button
            onClick={() => {
              audio.playClick();
              onPrintCertificate();
            }}
            className="btn-chunky flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 dark:from-[#2a3c4f] dark:to-[#203040] hover:bg-sky-100 text-sky-950 dark:text-sky-100 font-heading font-black text-base shadow-[0_4px_0_#0284c7] border-2 border-sky-300 dark:border-sky-500 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-200/80 dark:bg-[#1a2836] flex items-center justify-center text-xl text-sky-700 dark:text-sky-300">
                🎓
              </div>
              <div>
                <span className="block leading-tight">Cetak Sertifikat</span>
                <span className="text-[11px] font-sans font-bold text-sky-800/80 dark:text-sky-200/90 block">
                  Unduh atau cetak sertifikat para juara
                </span>
              </div>
            </div>
            <Award className="w-5 h-5 text-sky-700 dark:text-sky-300" />
          </button>

          {/* 5. Kembali ke Beranda */}
          <button
            onClick={() => {
              audio.playClick();
              onBackHome();
            }}
            className="btn-chunky flex items-center justify-between p-4 rounded-2xl bg-white/95 dark:bg-[#433420] hover:bg-amber-50 text-amber-950 dark:text-amber-100 font-heading font-black text-base shadow-[0_4px_0_#d97706] border-2 border-amber-300 dark:border-amber-600 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-[#342817] flex items-center justify-center text-xl text-amber-700 dark:text-amber-300">
                🏡
              </div>
              <div>
                <span className="block leading-tight">Kembali ke Beranda</span>
                <span className="text-[11px] font-sans font-bold text-amber-800/80 dark:text-amber-200/90 block">
                  Menuju halaman depan GAMBRENG
                </span>
              </div>
            </div>
            <Home className="w-5 h-5 text-amber-700 dark:text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
