import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { audio } from '../../utils/audio';

interface TutorialScreenProps {
  onStartGame: () => void;
  onBackMenu: () => void;
}

interface Step {
  title: string;
  badge: string;
  badgeColor: string;
  icon: string;
  description: string;
  highlight: string;
}

const STEPS: Step[] = [
  {
    title: '1. Kocok Dadu Berputar',
    badge: 'Langkah 1',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: '🎲',
    description: 'Setiap giliran, pemain mengetuk dadu. Dadu akan berputar lincah dan berhenti pada angka 1 sampai 6.',
    highlight: 'Dadu animasi dengan suara gemerincing seru!',
  },
  {
    title: '2. Maju Bidak Melompat',
    badge: 'Langkah 2',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: '🏃‍♂️',
    description: 'Bidak karaktermu akan melompat petak demi petak menyusuri jalanan pedesaan yang asri menuju sekolah.',
    highlight: 'Bidak memiliki bayangan lembut dan cincin warna khas pemain.',
  },
  {
    title: '3. Buka Kartu Petak',
    badge: 'Langkah 3',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: '🃏',
    description: 'Petak yang diinjak akan membuka kartu tantangan: Soal Hijau (Mudah), Kuning (Sedang), Merah (Tantang), Tantangan Ilmu 💡, Tantangan Seru 🎵, Cerita 🗺️, atau Bintang Keberuntungan ⭐!',
    highlight: 'Kamu juga bisa mengetuk tumpukan kartu di samping papan kapan saja!',
  },
  {
    title: '4. Jawab & Praktikkan Bersama',
    badge: 'Langkah 4',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    icon: '🗣️',
    description: 'Kamu boleh mengganti tingkat kesulitan sebelum menjawab! Gunakan tombol "Baca Nyaring" untuk mendengarkan soal. Jawaban salah TIDAK mengurangi poin dan bidakmu tidak akan mundur!',
    highlight: 'Belajar menyenangkan tanpa rasa takut salah!',
  },
  {
    title: '5. Semua Bermain Sampai Sekolah',
    badge: 'Langkah 5',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: '🏫',
    description: 'Pemain pertama yang tiba di Petak 50 (Sekolah) meraih Juara 1, namun pemain lain TETAP terus bermain sampai semuanya sampai di sekolah!',
    highlight: 'Tidak ada anak yang tereleminasi di tengah jalan!',
  },
  {
    title: '6. Podium & Unduh Sertifikat',
    badge: 'Langkah 6',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: '🎓',
    description: 'Di akhir permainan, semua pemain naik podium dan berhak mengunduh Sertifikat Prestasi resmi (format Gambar PNG & PDF A4) lengkap dengan nama panggilan dan lencana istimewa!',
    highlight: 'Setiap anak adalah pemenang sahabat belajar!',
  },
];

export const TutorialScreen: React.FC<TutorialScreenProps> = ({
  onStartGame,
  onBackMenu,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handlePrev = () => {
    audio.playClick();
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    audio.playClick();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onStartGame();
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 max-w-xl mx-auto select-none">
      <div className="w-full bg-gradient-to-b from-white/95 via-[#fefbf0]/95 to-[#fef3c7]/95 dark:bg-gradient-to-b dark:from-[#3a2d1d]/95 dark:via-[#423420]/95 dark:to-[#2e2316]/95 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 dark:border-amber-500 backdrop-blur-md">
        {/* Top header with step count */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${step.badgeColor}`}>
            {step.badge} dari {STEPS.length}
          </span>
          <button
            onClick={onBackMenu}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 dark:text-amber-300 underline cursor-pointer"
          >
            Kembali ke Menu
          </button>
        </div>

        {/* Carousel Content */}
        <div className="text-center py-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-amber-100 dark:bg-[#4d3c26] border-3 border-amber-300 dark:border-amber-600 flex items-center justify-center text-4xl sm:text-5xl shadow-md mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
            {step.icon}
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100 mb-3">
            {step.title}
          </h2>

          <p className="text-sm sm:text-base text-amber-800/90 dark:text-amber-200/90 mb-4 leading-relaxed font-bold">
            {step.description}
          </p>

          <div className="inline-block px-4 py-2 rounded-2xl bg-amber-100/80 dark:bg-[#4d3c26] border-2 border-amber-300 dark:border-amber-600 text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-100 shadow-xs">
            💡 {step.highlight}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 my-5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                audio.playClick();
                setCurrentStep(i);
              }}
              className={`h-3 rounded-full transition-all cursor-pointer ${
                i === currentStep ? 'w-8 bg-amber-500' : 'w-3 bg-amber-200 dark:bg-[#5a462d]'
              }`}
              title={`Langkah ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`btn-chunky flex items-center gap-1.5 px-4 py-3 rounded-2xl font-heading font-black text-sm border-2 ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed bg-amber-100/40 text-amber-700/60 border-amber-200'
                : 'bg-white dark:bg-[#4d3c26] hover:bg-amber-50 text-amber-950 dark:text-amber-100 border-amber-300 dark:border-amber-600 shadow-[0_4px_0_#d97706] cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={handleNext}
            className="btn-chunky flex items-center justify-center gap-2 flex-1 px-5 py-3 rounded-2xl font-heading font-black text-base sm:text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-[0_6px_0_#c2410c] border border-amber-300 cursor-pointer"
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                <span>Ayo Main Sekarang!</span>
                <Play className="w-5 h-5 fill-current" />
              </>
            ) : (
              <>
                <span>Selanjutnya</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
