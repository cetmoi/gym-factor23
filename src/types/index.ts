export interface WorkoutExercise {
  id: number;
  name: string;
  category: string;
  type: 'strength' | 'cardio';
  targetSets?: number;
  targetReps?: string;
  targetDuration?: string;
  description?: string;
  instructions?: string[];
  musclesWorked?: string[];
}

export interface StrengthSet {
  weight: number;
  reps: number;
  completed: boolean;
  timestamp: string;
}

export interface CardioSession {
  duration: number;
  intensity: number;
  incline?: number;
  completed: boolean;
  timestamp: string;
}

export interface ExerciseData {
  exerciseId: number;
  type: 'strength' | 'cardio';
  sets: StrengthSet[];
  cardioSessions: CardioSession[];
  completed: boolean;
  notes: string;
}

export interface DailyWorkout {
  date: string;
  programDay: 'A' | 'B' | null;
  exercises: WorkoutExercise[];
  isRestDay: boolean;
}

export interface WorkoutStats {
  totalSessions: number;
  totalDuration: number;
  averageDuration: number;
  currentStreak: number;
  longestStreak: number;
  totalSets: number;
  totalReps: number;
  favoriteExercises: { exerciseId: number; count: number }[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  frequency: 2 | 3 | 4;
  type: 'single' | 'alternating';
  exercises?: number[];
  exercisesA?: number[];
  exercisesB?: number[];
  createdAt: string;
  lastModified?: string;
}