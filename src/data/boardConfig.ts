import { BoardTile, TileType } from '../types/game';

// 50-tile winding path from Tile 1 (RUMAH - START at bottom) to Tile 50 (SEKOLAH - FINISH at top)
// 7 winding rows:
// Row 7 (bottom): tiles 1-7 (left to right)
// Row 6: tiles 8-14 (right to left)
// Row 5: tiles 15-21 (left to right)
// Row 4: tiles 22-28 (right to left)
// Row 3: tiles 29-35 (left to right)
// Row 2: tiles 36-42 (right to left)
// Row 1 (top): tiles 43-50 (left to right)

const generateTileTypes = (): TileType[] => {
  // Balanced distribution of card types across the 50 tiles
  const types: TileType[] = [];
  const pattern: TileType[] = [
    'low', 'middle', 'science', 'low', 'middle', 'high', 'fun',
    'low', 'luck', 'middle', 'story', 'low', 'high', 'science',
    'middle', 'low', 'fun', 'high', 'luck', 'middle', 'story',
    'low', 'science', 'middle', 'high', 'fun', 'low', 'luck',
    'middle', 'story', 'low', 'science', 'high', 'middle', 'fun',
    'low', 'luck', 'middle', 'science', 'high', 'story', 'low',
    'middle', 'fun', 'high', 'luck', 'science', 'middle', 'high'
  ];
  
  // tile 1 (Start)
  types.push('low');
  for (let i = 1; i < 49; i++) {
    types.push(pattern[i % pattern.length]);
  }
  // tile 50 (Finish)
  types.push('high');
  return types;
};

const tileTypes = generateTileTypes();

export const BOARD_TILES: BoardTile[] = [
  // Row 7: bottom (y: 92%), tiles 1 to 7 left to right
  { number: 1, type: tileTypes[0], x: 10, y: 92, label: 'RUMAH - START' },
  { number: 2, type: tileTypes[1], x: 23, y: 92 },
  { number: 3, type: tileTypes[2], x: 36, y: 92 },
  { number: 4, type: tileTypes[3], x: 50, y: 92 },
  { number: 5, type: tileTypes[4], x: 63, y: 92 },
  { number: 6, type: tileTypes[5], x: 76, y: 92 },
  { number: 7, type: tileTypes[6], x: 90, y: 92 },

  // Row 6: y: 78%, tiles 8 to 14 right to left
  { number: 8, type: tileTypes[7], x: 90, y: 78 },
  { number: 9, type: tileTypes[8], x: 76, y: 78 },
  { number: 10, type: tileTypes[9], x: 63, y: 78 },
  { number: 11, type: tileTypes[10], x: 50, y: 78 },
  { number: 12, type: tileTypes[11], x: 36, y: 78 },
  { number: 13, type: tileTypes[12], x: 23, y: 78 },
  { number: 14, type: tileTypes[13], x: 10, y: 78 },

  // Row 5: y: 64%, tiles 15 to 21 left to right
  { number: 15, type: tileTypes[14], x: 10, y: 64 },
  { number: 16, type: tileTypes[15], x: 23, y: 64 },
  { number: 17, type: tileTypes[16], x: 36, y: 64 },
  { number: 18, type: tileTypes[17], x: 50, y: 64 },
  { number: 19, type: tileTypes[18], x: 63, y: 64 },
  { number: 20, type: tileTypes[19], x: 76, y: 64 },
  { number: 21, type: tileTypes[20], x: 90, y: 64 },

  // Row 4: y: 50%, tiles 22 to 28 right to left
  { number: 22, type: tileTypes[21], x: 90, y: 50 },
  { number: 23, type: tileTypes[22], x: 76, y: 50 },
  { number: 24, type: tileTypes[23], x: 63, y: 50 },
  { number: 25, type: tileTypes[24], x: 50, y: 50 },
  { number: 26, type: tileTypes[25], x: 36, y: 50 },
  { number: 27, type: tileTypes[26], x: 23, y: 50 },
  { number: 28, type: tileTypes[27], x: 10, y: 50 },

  // Row 3: y: 36%, tiles 29 to 35 left to right
  { number: 29, type: tileTypes[28], x: 10, y: 36 },
  { number: 30, type: tileTypes[29], x: 23, y: 36 },
  { number: 31, type: tileTypes[30], x: 36, y: 36 },
  { number: 32, type: tileTypes[31], x: 50, y: 36 },
  { number: 33, type: tileTypes[32], x: 63, y: 36 },
  { number: 34, type: tileTypes[33], x: 76, y: 36 },
  { number: 35, type: tileTypes[34], x: 90, y: 36 },

  // Row 2: y: 22%, tiles 36 to 42 right to left
  { number: 36, type: tileTypes[35], x: 90, y: 22 },
  { number: 37, type: tileTypes[36], x: 76, y: 22 },
  { number: 38, type: tileTypes[37], x: 63, y: 22 },
  { number: 39, type: tileTypes[38], x: 50, y: 22 },
  { number: 40, type: tileTypes[39], x: 36, y: 22 },
  { number: 41, type: tileTypes[40], x: 23, y: 22 },
  { number: 42, type: tileTypes[41], x: 10, y: 22 },

  // Row 1: top (y: 8%), tiles 43 to 50 left to right
  { number: 43, type: tileTypes[42], x: 10, y: 8 },
  { number: 44, type: tileTypes[43], x: 21, y: 8 },
  { number: 45, type: tileTypes[44], x: 33, y: 8 },
  { number: 46, type: tileTypes[45], x: 45, y: 8 },
  { number: 47, type: tileTypes[46], x: 57, y: 8 },
  { number: 48, type: tileTypes[47], x: 69, y: 8 },
  { number: 49, type: tileTypes[48], x: 80, y: 8 },
  { number: 50, type: tileTypes[49], x: 92, y: 8, label: 'SEKOLAH - FINISH' },
];

export const TILE_META: Record<TileType, { name: string; color: string; bgClass: string; borderClass: string; icon: string; points: number }> = {
  low: {
    name: 'Soal Dasar',
    color: '#22c55e',
    bgClass: 'bg-emerald-500 text-white',
    borderClass: 'border-emerald-600',
    icon: '🟢',
    points: 1,
  },
  middle: {
    name: 'Soal Menengah',
    color: '#eab308',
    bgClass: 'bg-amber-400 text-amber-950',
    borderClass: 'border-amber-500',
    icon: '🟡',
    points: 2,
  },
  high: {
    name: 'Soal Tantang',
    color: '#ef4444',
    bgClass: 'bg-rose-500 text-white',
    borderClass: 'border-rose-600',
    icon: '🔴',
    points: 3,
  },
  science: {
    name: 'Tantangan Ilmu',
    color: '#3b82f6',
    bgClass: 'bg-sky-500 text-white',
    borderClass: 'border-sky-600',
    icon: '💡',
    points: 2,
  },
  fun: {
    name: 'Tantangan Seru',
    color: '#ec4899',
    bgClass: 'bg-pink-500 text-white',
    borderClass: 'border-pink-600',
    icon: '🎵',
    points: 2,
  },
  story: {
    name: 'Cerita Pengalaman',
    color: '#14b8a6',
    bgClass: 'bg-teal-500 text-white',
    borderClass: 'border-teal-600',
    icon: '🗺️',
    points: 1,
  },
  luck: {
    name: 'Keberuntungan',
    color: '#a855f7',
    bgClass: 'bg-purple-500 text-white',
    borderClass: 'border-purple-600',
    icon: '⭐',
    points: 0,
  },
};
