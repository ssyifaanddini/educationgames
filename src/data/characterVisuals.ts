export interface CharacterVisualConfig {
  id: string;
  fileName: string;
  // Standing pawn / full figure normalization
  standingScale: number;
  standingTranslateY: string;
  standingTranslateX: string;
  // Circular avatar face normalization using robust object-position
  avatarObjectPositionX: string;
  avatarObjectPositionY: string;
  avatarScale: number;
}

export const CHARACTER_VISUALS: Record<string, CharacterVisualConfig> = {
  boris: {
    id: 'boris',
    fileName: 'boris.png',
    standingScale: 1.01,
    standingTranslateY: '2%',
    standingTranslateX: '-1%',
    avatarObjectPositionX: '48%',
    avatarObjectPositionY: '17%',
    avatarScale: 1.25,
  },
  ajeng: {
    id: 'ajeng',
    fileName: 'ajeng.png',
    standingScale: 1.0,
    standingTranslateY: '2%',
    standingTranslateX: '0%',
    avatarObjectPositionX: '50%',
    avatarObjectPositionY: '16%',
    avatarScale: 1.25,
  },
  andi: {
    id: 'andi',
    fileName: 'andi.png',
    standingScale: 1.02,
    standingTranslateY: '7%',
    standingTranslateX: '2%',
    avatarObjectPositionX: '53%',
    avatarObjectPositionY: '18%',
    avatarScale: 1.25,
  },
  lestari: {
    id: 'lestari',
    fileName: 'lestari.png',
    standingScale: 1.03,
    standingTranslateY: '6%',
    standingTranslateX: '2%',
    avatarObjectPositionX: '53%',
    avatarObjectPositionY: '21%',
    avatarScale: 1.25,
  },
  maria: {
    id: 'maria',
    fileName: 'maria.png',
    standingScale: 1.02,
    standingTranslateY: '5%',
    standingTranslateX: '3%',
    avatarObjectPositionX: '54%',
    avatarObjectPositionY: '22%',
    avatarScale: 1.25,
  },
};

export function getCharacterVisual(fileNameOrId: string): CharacterVisualConfig {
  const clean = (fileNameOrId || '')
    .toLowerCase()
    .replace('.png', '')
    .replace(/^\/+/, '')
    .trim();

  return (
    CHARACTER_VISUALS[clean] || {
      id: clean,
      fileName: `${clean}.png`,
      standingScale: 1.0,
      standingTranslateY: '3%',
      standingTranslateX: '0%',
      avatarObjectPositionX: '50%',
      avatarObjectPositionY: '18%',
      avatarScale: 1.25,
    }
  );
}
