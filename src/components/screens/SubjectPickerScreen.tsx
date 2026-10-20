import React, { useState, useRef } from 'react';
import { Subject, SubjectId } from '../../types/game';
import { SUBJECTS } from '../../data/subjects';
import { audio } from '../../utils/audio';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SubjectPickerScreenProps {
  onSelectSubject: (subject: Subject) => void;
  onBack: () => void;
}

export const SubjectPickerScreen: React.FC<SubjectPickerScreenProps> = ({
  onSelectSubject,
  onBack,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const currentRotationRef = useRef(0);

  const handleCardClick = (sub: Subject) => {
    if (isSpinning) return;
    audio.playClick();
    setSelectedSubject(sub);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    audio.playDiceRoll();
    setIsSpinning(true);
    setSelectedSubject(null);

    // Pick random subject
    const randomIndex = Math.floor(Math.random() * SUBJECTS.length);
    const targetSubject = SUBJECTS[randomIndex];

    // Each slice is 360 / 5 = 72 degrees
    // Calculate final angle to land on randomIndex with overshoot
    const sliceAngle = 360 / SUBJECTS.length;
    // We point to top (270 deg or pointer at top)
    const extraSpins = (4 + Math.floor(Math.random() * 2)) * 360;
    // Align slice center with pointer at top (-90 degrees)
    const targetSliceCenter = (SUBJECTS.length - randomIndex) * sliceAngle - sliceAngle / 2;
    const finalRotation = currentRotationRef.current + extraSpins + (targetSliceCenter % 360);

    setWheelRotation(finalRotation);
    currentRotationRef.current = finalRotation;

    // Spinner animation takes 3.2s with cubic-bezier overshoot
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedSubject(targetSubject);
      audio.playCorrect();
    }, 3200);
  };

  const handleConfirm = () => {
    if (!selectedSubject) return;
    audio.playClick();
    onSelectSubject(selectedSubject);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-start p-4 max-w-2xl mx-auto">
      {/* Header Info - Translucent #5b8225 Moss Green Card */}
      <div
        className="text-center mb-4 p-4 sm:p-5 rounded-3xl shadow-xl border-3 border-emerald-300/80 backdrop-blur-md w-full transition-all"
        style={{ backgroundColor: 'rgba(91, 130, 37, 0.85)' }}
      >
        <button
          onClick={onBack}
          className="text-xs font-bold text-lime-200 hover:text-white underline mb-2 block mx-auto transition-colors"
        >
          ← Kembali ke Menu
        </button>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white drop-shadow-md mb-2">
          Pilih Mata Pelajaran
        </h2>
        <div className="inline-block px-3.5 py-1.5 rounded-2xl bg-white/95 dark:bg-white/95 shadow-sm border border-emerald-200">
          <p
            className="text-[15px] font-bold text-[#48a600]"
            style={{ fontSize: '15px', fontWeight: 'bold', color: '#48a600', fontFamily: 'Nunito, sans-serif' }}
          >
            Putar Roda Keberuntungan atau langsung ketuk kartu mata pelajaran di bawah!
          </p>
        </div>
      </div>

      {/* Subject Spinner Wheel Section */}
      <div className="relative flex flex-col items-center my-2">
        {/* Pointer at Top */}
        <div className="relative z-20 -mb-3 text-red-500 text-3xl filter drop-shadow animate-bounce">
          ▼
        </div>

        {/* Wheel Container */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-200 shadow-xl border-4 border-amber-500">
          <div
            className="w-full h-full rounded-full overflow-hidden relative shadow-inner transition-transform duration-[3200ms]"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transitionTimingFunction: 'cubic-bezier(0.15, 0.9, 0.25, 1.05)', // smooth slowdown with small overshoot
            }}
          >
            {/* SVG Wheel with 5 slices */}
            <svg viewBox="-100 -100 200 200" className="w-full h-full">
              {SUBJECTS.map((sub, i) => {
                const angle = 360 / SUBJECTS.length;
                const startAngle = (i * angle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);
                const x1 = 100 * Math.cos(startAngle);
                const y1 = 100 * Math.sin(startAngle);
                const x2 = 100 * Math.cos(endAngle);
                const y2 = 100 * Math.sin(endAngle);
                const midAngle = ((i + 0.5) * angle - 90) * (Math.PI / 180);
                const textX = 65 * Math.cos(midAngle);
                const textY = 65 * Math.sin(midAngle);

                return (
                  <g key={sub.id}>
                    <path
                      d={`M 0 0 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                      fill={sub.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sub.icon}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Wheel Center Button (Spin!) */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`btn-chunky absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full font-heading font-black text-xs sm:text-sm flex flex-col items-center justify-center border-3 border-white shadow-lg transition-transform ${
              isSpinning
                ? 'bg-slate-400 text-white cursor-not-allowed scale-95'
                : 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-[0_4px_0_#d97706] hover:scale-105 active:scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5 text-amber-800" />
            <span>{isSpinning ? 'Berputar...' : 'PUTAR!'}</span>
          </button>
        </div>
      </div>

      {/* Highlighted Result / Action Banner */}
      {selectedSubject && (
        <div className="w-full mt-3 p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-400 text-center animate-bounce shadow-md">
          <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
            Terpilih: <strong className="text-base text-amber-950 dark:text-amber-100">{selectedSubject.icon} {selectedSubject.name}</strong>
          </p>
          <button
            onClick={handleConfirm}
            className="btn-chunky mt-2 inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-black text-sm shadow-[0_3px_0_#059669]"
          >
            <span>Lanjutkan dengan {selectedSubject.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Subject Cards */}
      <div className="w-full mt-5">
        <h3 className="font-heading font-black text-sm sm:text-base text-amber-950 dark:text-amber-100 mb-3 text-center drop-shadow-xs">
          🌾 Atau Pilih Langsung Mata Pelajaran:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SUBJECTS.map((sub) => {
            const isSelected = selectedSubject?.id === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => handleCardClick(sub)}
                className={`btn-chunky relative p-4 sm:p-5 rounded-3xl border-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 dark:from-[#453723] dark:via-[#4d3d27] dark:to-[#382b1b] border-amber-500 dark:border-amber-400 shadow-[0_6px_0_#d97706] scale-[1.03] ring-2 ring-amber-300'
                    : 'bg-white/95 dark:bg-[#342817]/90 border-amber-200 dark:border-amber-700/70 hover:border-amber-400 shadow-[0_4px_0_rgba(217,119,6,0.18)]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 border border-amber-300/80 bg-white/90 dark:bg-[#4a3a23]"
                    style={{ backgroundColor: `${sub.color}22` }}
                  >
                    {sub.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-black text-base sm:text-lg text-amber-950 dark:text-amber-100 truncate">
                      {sub.name}
                    </h4>
                    <p className="text-xs text-amber-800/80 dark:text-amber-200/90 line-clamp-2 mt-0.5 font-bold leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
