export type SubjectId = 'matematika' | 'ipas' | 'bahasa-indonesia' | 'pancasila' | 'bahasa-inggris';

export interface Subject {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  description: string;
}

export type Semester = 'ganjil' | 'genap';

export interface TopicReading {
  summary: string;
  keyPoints: string[];
  funFact?: string;
  exampleStory?: string;
  externalLink?: {
    title: string;
    url: string;
  };
}

export interface Topic {
  id: string;
  title: string;
  semester: Semester;
  subjectId: SubjectId;
  icon: string;
  summary: string;
  reading: TopicReading;
}

export type QuestionLevel = 'low' | 'middle' | 'high';

export type QuestionType = 'choice' | 'short' | 'oral';

export interface QuestionCard {
  id: string;
  subjectId: SubjectId;
  level: QuestionLevel;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface ChallengeCard {
  id: string;
  type: 'science' | 'fun'; // 'science' = Tantangan Ilmu, 'fun' = Tantangan Seru
  title: string;
  task: string;
  instruction: string;
  points: number;
}

export interface StoryCard {
  id: string;
  title: string;
  prompt: string;
  subtext: string;
  points: number;
}

export interface LuckCard {
  id: string;
  title: string;
  description: string;
  actionType: 'bonus_points' | 'roll_again' | 'advance_tiles' | 'shield';
  value: number;
}

export interface CharacterDef {
  id: string;
  name: string;
  origin: string; // Dani, Bugis, Batak, Jawa, Dayak
  fileName: string; // maria.png, andi.png, boris.png, ajeng.png, lestari.png
  description: string;
  primaryColor: string;
  accentColor: string;
}

export interface Player {
  id: string;
  characterId: string;
  characterName: string;
  nickname: string;
  fileName: string;
  color: string;
  currentTile: number; // 1 to 50
  score: number;
  isFinished: boolean;
  finishRank?: number;
  challengesCompleted: number;
  storiesShared: number;
  correctAnswersCount: number;
}

export type TileType = 
  | 'low'          // Green - Kartu Soal Low (1 poin)
  | 'middle'       // Yellow - Kartu Soal Middle (2 poin)
  | 'high'         // Red - Kartu Soal High (3 poin)
  | 'science'      // Lightbulb icon - Tantangan Ilmu (+2 poin)
  | 'fun'          // Music note - Tantangan Seru (+2 poin)
  | 'story'        // Map icon - Cerita Pengalaman (+1 poin)
  | 'luck';        // Purple star - Kartu Keberuntungan

export interface BoardTile {
  number: number;
  type: TileType;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  label?: string;
}

export type TimeMode = '30m' | '60m' | 'unlimited';

export type ScreenState = 
  | 'cover'
  | 'menu'
  | 'tutorial'
  | 'subject-picker'
  | 'subject-action'
  | 'materi'
  | 'game-setup'
  | 'game'
  | 'podium'
  | 'certificates'
  | 'final';

export interface CategoryBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}
