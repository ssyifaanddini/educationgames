import React, { useState, useRef } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { CHARACTERS } from '../../data/characters';
import { getCharacterVisual } from '../../data/characterVisuals';
import { audio } from '../../utils/audio';

interface CoverScreenProps {
  onNext: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onNext }) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; isInteracting: boolean }>({
    rx: 0,
    ry: 0,
    isInteracting: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const ry = ((x - centerX) / centerX) * 14; // max 14 deg tilt on Y
    const rx = -((y - centerY) / centerY) * 12; // max 12 deg tilt on X
    setTilt({ rx, ry, isInteracting: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, isInteracting: false });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const ry = Math.max(-12, Math.min(12, ((x - centerX) / centerX) * 12));
    const rx = Math.max(-10, Math.min(10, -((y - centerY) / centerY) * 10));
    setTilt({ rx, ry, isInteracting: true });
  };

  const handleTouchEnd = () => {
    setTilt({ rx: 0, ry: 0, isInteracting: false });
  };

  const handleStart = () => {
    audio.playClick();
    onNext();
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-between p-4 pb-8 max-w-lg mx-auto text-center">
      {/* Top Banner / Extra confetti sparkle hint */}
      <div className="w-full flex justify-center pt-2">
        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-md border-2 border-amber-300 animate-pulse">
          🌟 Petualangan Kurikulum Merdeka Kelas 4 SD 🌟
        </span>
      </div>

      {/* Center: 3D Floating Logo blending naturally with the scenic village background */}
      <div className="my-auto w-full flex flex-col items-center">
        {/* 3D Perspective Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center py-2 sm:py-4 cursor-pointer select-none [perspective:1000px]"
          title="Ketuk atau gerakkan kursor untuk efek 3D!"
        >
          {/* Subtle soft warm sun/moon halo behind the logo for organic atmosphere */}
          <div className="absolute inset-x-6 inset-y-1 bg-gradient-to-r from-amber-300/35 via-yellow-200/50 to-orange-300/35 dark:from-sky-300/25 dark:via-indigo-200/35 dark:to-emerald-300/25 blur-3xl rounded-full pointer-events-none -z-10" />

          {/* Floating 3D Sparkle Badges around logo */}
          <div className="absolute -top-1 left-4 sm:left-6 z-20 pointer-events-none animate-bounce text-xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            ✨
          </div>
          <div
            className="absolute -bottom-1 right-4 sm:right-6 z-20 pointer-events-none animate-pulse text-xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            style={{ animationDelay: '1s' }}
          >
            ⭐
          </div>

          {/* Inner 3D Tilt Element */}
          <div
            className={`relative min-h-[140px] sm:min-h-[175px] w-full flex items-center justify-center transition-transform ${
              tilt.isInteracting ? 'duration-100 ease-out' : 'duration-700 ease-out animate-logo-3d'
            }`}
            style={{
              transform: tilt.isInteracting
                ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(26px) scale(1.04)`
                : undefined,
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src="/logo.png"
              alt="GAMBRENG - Ayo Belajar Bareng!"
              className="relative z-10 w-full max-h-48 sm:max-h-64 object-contain mx-auto filter drop-shadow-[0_20px_26px_rgba(0,0,0,0.34)] drop-shadow-[0_6px_0_rgba(194,65,12,0.48)] drop-shadow-[0_-1px_3px_rgba(255,255,255,0.85)] transition-all duration-300"
              onLoad={() => {
                setLogoLoaded(true);
                setLogoFailed(false);
              }}
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.includes('src/assets/images')) {
                  img.src = '/src/assets/images/logo.png';
                } else {
                  setLogoFailed(true);
                }
              }}
            />

            {/* Fallback only shown if image truly failed both paths */}
            {logoFailed && !logoLoaded && (
              <div className="relative z-10 flex flex-col items-center justify-center p-5 bg-gradient-to-b from-amber-100 to-orange-100 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-2xl">
                <h1 className="font-heading text-3xl sm:text-4xl font-black text-amber-800 drop-shadow-md">
                  GAMBRENG
                </h1>
                <p className="text-sm font-bold text-amber-950 mt-1">Ayo Belajar Bareng!</p>
              </div>
            )}
          </div>
        </div>

        {/* The Five Characters standing proudly on the village path */}
        <div className="mt-3 sm:mt-5 w-full">
          <div className="flex items-end justify-center gap-1 sm:gap-2.5 px-2">
            {CHARACTERS.map((char, index) => {
              const visual = getCharacterVisual(char.fileName);
              return (
                <div
                  key={char.id}
                  className="flex flex-col items-center transition-all duration-300 animate-gentle-bounce group"
                  style={{
                    animationDelay: `${index * 0.35}s`,
                  }}
                >
                  {/* Character Image Element standing on path with ground shadow */}
                  <div className="h-28 sm:h-36 w-16 sm:w-24 flex items-end justify-center filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.32)] overflow-visible">
                    <img
                      src={`/${char.fileName}`}
                      alt={char.name}
                      className="h-full w-auto max-w-none object-contain object-bottom origin-bottom transition-transform group-hover:scale-110"
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
                  </div>
                  {/* Name & Origin pill with soft nature shadow */}
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-[#4d3c26] text-[10px] sm:text-xs font-black shadow-md border-2 border-amber-300 dark:border-amber-600 text-amber-950 dark:text-amber-100 backdrop-blur-xs">
                    {char.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: Triangle "Next" Button */}
      <div className="w-full flex justify-center pt-4">
        <button
          onClick={handleStart}
          className="btn-chunky group relative flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white font-heading font-black text-xl sm:text-2xl px-10 py-4 rounded-3xl shadow-[0_8px_0_#c2410c] border-2 border-amber-300 active:translate-y-2 active:shadow-none transition-all w-full max-w-xs"
        >
          <span className="tracking-wide">Mulai Main</span>
          <div className="w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
};
