import React, { useState, useEffect } from 'react';
import { getCharacterVisual } from '../../data/characterVisuals';

interface CharacterPawnProps {
  fileName: string;
  name: string;
  ringColor: string;
  isCurrentTurn?: boolean;
  isHopping?: boolean;
}

export const CharacterPawn: React.FC<CharacterPawnProps> = ({
  fileName,
  name,
  ringColor,
  isCurrentTurn = false,
  isHopping = false,
}) => {
  const cleanName = (fileName || 'maria.png').replace(/^\/+/, '');
  const [imgSrc, setImgSrc] = useState<string>(`/${cleanName}`);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    const clean = (fileName || 'maria.png').replace(/^\/+/, '');
    setImgSrc(`/${clean}`);
    setLoadError(false);
  }, [fileName]);

  const visual = getCharacterVisual(fileName);

  const handleError = () => {
    const clean = (fileName || 'maria.png').replace(/^\/+/, '');
    if (!imgSrc.includes('assets')) {
      setImgSrc(`/src/assets/images/${clean}`);
    } else {
      setLoadError(true);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-all duration-300 pointer-events-none select-none ${
        isHopping ? 'animate-pawn-hop z-30' : 'z-20'
      }`}
    >
      {/* Current Turn Indicator arrow */}
      {isCurrentTurn && (
        <span className="absolute -top-4 text-xs font-black text-amber-500 drop-shadow animate-bounce">
          ▼
        </span>
      )}

      {/* Pawn Figure: Equal uniform height for all characters */}
      <div className="relative h-12 sm:h-14 w-12 sm:w-14 flex items-end justify-center drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] overflow-visible">
        {!loadError ? (
          <img
            src={imgSrc}
            alt={name}
            className="h-full w-auto max-w-none object-contain object-bottom transition-transform origin-bottom select-none"
            style={{
              transform: `scale(${visual.standingScale}) translate(${visual.standingTranslateX}, ${visual.standingTranslateY})`,
            }}
            onLoad={() => setLoadError(false)}
            onError={handleError}
          />
        ) : (
          <div className="w-8 h-10 bg-white/95 rounded-t-lg border-2 border-slate-700 flex flex-col items-center justify-center text-[8px] font-bold text-slate-800 text-center leading-tight shadow">
            <span>{name ? name[0] : 'P'}</span>
          </div>
        )}
      </div>

      {/* Colored Ring Under Each Pawn + Soft Shadow */}
      <div
        className="relative -mt-1 w-7 h-2.5 sm:w-8 sm:h-3 rounded-full border-2 shadow-sm transition-transform"
        style={{
          borderColor: ringColor,
          backgroundColor: `${ringColor}40`,
          boxShadow: `0 3px 6px rgba(0,0,0,0.35), 0 0 8px ${ringColor}88`,
        }}
      />
    </div>
  );
};
