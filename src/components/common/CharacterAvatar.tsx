import React, { useState, useEffect } from 'react';
import { getCharacterVisual } from '../../data/characterVisuals';

interface CharacterAvatarProps {
  fileName: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  ringColor?: string;
  className?: string;
  isCropCircle?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  fileName,
  name,
  size = 'md',
  ringColor,
  className = '',
  isCropCircle = true,
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

  const sizeClasses = {
    xs: 'w-7 h-7 sm:w-8 sm:h-8',
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  const ringStyle = ringColor ? { borderColor: ringColor } : {};

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${
        isCropCircle
          ? `rounded-full overflow-hidden border-2 sm:border-3 bg-white dark:bg-slate-800 shadow-md ${sizeClasses}`
          : sizeClasses
      } ${className}`}
      style={ringStyle}
    >
      {!loadError ? (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center pointer-events-none select-none">
          {isCropCircle ? (
            <img
              src={imgSrc}
              alt={name || 'Karakter'}
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{
                objectPosition: `${visual.avatarObjectPositionX} ${visual.avatarObjectPositionY}`,
                transform: `scale(${visual.avatarScale})`,
              }}
              onLoad={() => setLoadError(false)}
              onError={handleError}
            />
          ) : (
            <img
              src={imgSrc}
              alt={name || 'Karakter'}
              className="max-h-full max-w-full object-contain select-none pointer-events-none"
              onLoad={() => setLoadError(false)}
              onError={handleError}
            />
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-300 p-0.5 text-center font-bold">
          <span className="text-[10px] leading-tight truncate max-w-full">
            {name ? name.slice(0, 2).toUpperCase() : '?'}
          </span>
        </div>
      )}
    </div>
  );
};
