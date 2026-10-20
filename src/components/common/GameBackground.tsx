import React from 'react';
import { ScreenState } from '../../types/game';

interface GameBackgroundProps {
  screen: ScreenState;
  darkMode: boolean;
}

// Fixed twinkling star coordinates across upper sky (percentage-based)
const NIGHT_STARS = [
  { top: '8%', left: '12%', size: 3, delay: '0s', dur: '2.4s' },
  { top: '14%', left: '24%', size: 4, delay: '0.8s', dur: '3.1s' },
  { top: '6%', left: '38%', size: 2.5, delay: '1.4s', dur: '2.7s' },
  { top: '18%', left: '46%', size: 5, delay: '0.3s', dur: '3.5s' }, // bright star near moon
  { top: '10%', left: '58%', size: 3, delay: '1.8s', dur: '2.9s' },
  { top: '5%', left: '72%', size: 4, delay: '0.5s', dur: '3.3s' },
  { top: '15%', left: '84%', size: 3.5, delay: '1.1s', dur: '2.6s' },
  { top: '22%', left: '92%', size: 2.5, delay: '2.0s', dur: '3.0s' },
  { top: '12%', left: '5%', size: 2, delay: '0.7s', dur: '2.8s' },
  { top: '24%', left: '32%', size: 3, delay: '1.6s', dur: '3.4s' },
  { top: '26%', left: '68%', size: 2.5, delay: '0.9s', dur: '2.5s' },
  { top: '20%', left: '78%', size: 4, delay: '2.2s', dur: '3.2s' },
];

// Gentle glowing fireflies hovering over rice terraces
const FIREFLIES = [
  { bottom: '28%', left: '22%', delay: '0.2s', dur: '3.8s' },
  { bottom: '22%', left: '48%', delay: '1.5s', dur: '4.4s' },
  { bottom: '34%', left: '76%', delay: '0.9s', dur: '4.1s' },
  { bottom: '18%', left: '88%', delay: '2.1s', dur: '3.6s' },
];

export const GameBackground: React.FC<GameBackgroundProps> = ({ screen, darkMode }) => {
  if (screen === 'certificates') {
    // Clean parchment background for printing & certificate preview
    return <div className="fixed inset-0 bg-[#fdfbf7] dark:bg-[#2c2217] pointer-events-none -z-10" />;
  }

  const isCover = screen === 'cover';
  const isMenu = screen === 'menu';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Village Landscape Background Image for EVERY Screen (Day & Night) */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          key={darkMode ? 'night' : 'day'}
          src={darkMode ? '/bg-peta-malam.png' : '/background.png'}
          alt={
            darkMode
              ? 'Pemandangan Pedesaan Sawah Indonesia Malam Hari (bg-peta-malam)'
              : 'Pedesaan Sawah Indonesia Pagi Cerah'
          }
          className="w-full h-full object-cover object-center scale-100 transition-opacity duration-700"
          onError={(e) => {
            const img = e.currentTarget;
            if (darkMode) {
              if (!img.src.includes('bg_peta_malam')) {
                img.src = '/src/assets/images/bg_peta_malam_1791881351480.jpg';
              } else if (!img.src.includes('village_night')) {
                img.src = '/src/assets/images/village_night_stars_1791817313567.jpg';
              }
            } else {
              if (!img.src.includes('village_background')) {
                img.src = '/src/assets/images/village_background_1791805016471.jpg';
              }
            }
          }}
        />

        {/* Night Sky: Dynamic Twinkling Stars (Berkelip-kelip) */}
        {darkMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {NIGHT_STARS.map((star, idx) => (
              <div
                key={`star-${idx}`}
                className="absolute rounded-full bg-white animate-star-twinkle"
                style={{
                  top: star.top,
                  left: star.left,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDelay: star.delay,
                  animationDuration: star.dur,
                  boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.9), 0 0 12px 4px rgba(186, 230, 253, 0.6)',
                }}
              />
            ))}

            {/* Glowing Fireflies hovering over the night rice paddies */}
            {FIREFLIES.map((fly, idx) => (
              <div
                key={`fly-${idx}`}
                className="absolute w-2 h-2 rounded-full bg-yellow-300 animate-firefly"
                style={{
                  bottom: fly.bottom,
                  left: fly.left,
                  animationDelay: fly.delay,
                  animationDuration: fly.dur,
                  boxShadow: '0 0 8px 3px rgba(250, 204, 21, 0.95)',
                }}
              />
            ))}
          </div>
        )}

        {/* Soft atmospheric overlay tailored for content readability */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            darkMode
              ? isCover || isMenu
                ? 'bg-indigo-950/15'
                : 'bg-indigo-950/35 backdrop-blur-[1px]'
              : isCover || isMenu
              ? 'bg-gradient-to-b from-sky-500/10 via-transparent to-amber-950/20'
              : 'bg-amber-50/45 backdrop-blur-[1px]'
          }`}
        />
      </div>
    </div>
  );
};
