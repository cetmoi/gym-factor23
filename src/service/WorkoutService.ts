import StorageService from './StorageService';
import { getExerciseById } from '../data/exercises';
import { DailyWorkout, WorkoutStats, WorkoutExercise } from '../types';

class WorkoutService {
  
  static async getTodayWorkout(): Promise<DailyWorkout | null> {
    try {
      const program = await StorageService.getCurrentProgram();
      if (!program) return null;

      const today = new Date();
      const dayOfWeek = today.getDay();
      const frenchDay = dayOfWeek === 0 ? 7 : dayOfWeek;
      
      const workoutDays = StorageService.getWorkoutDays(program.frequency);
      const isWorkoutDay = workoutDays.includes(frenchDay);
      
      if (!isWorkoutDay) {
        return {
          date: today.toISOString(),
          programDay: null,
          exercises: [],
          isRestDay: true,
        };
      }

      let programDay: 'A' | 'B' | null = null;
      let exerciseIds: number[] = [];

      if (program.type === 'single') {
        exerciseIds = program.exercises || [];
      } else if (program.type === 'alternating') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (frenchDay - 1));
        
        const sessionsThisWeek = await this.getSessionsCountSince(weekStart);
        programDay = sessionsThisWeek % 2 === 0 ? 'A' : 'B';
        
        exerciseIds = programDay === 'A' 
          ? (program.exercisesA || [])
          : (program.exercisesB || []);
      }

      const exercises = exerciseIds.map(id => {
        const exercise = getExerciseById(id);
        if (!exercise) return null;

        return {
          ...exercise,
          type: exercise.category === 'Cardio' ? 'cardio' : 'strength',
        } as WorkoutExercise;
      }).filter(Boolean) as WorkoutExercise[];

      return {
        date: today.toISOString(),
        programDay,
        exercises,
        isRestDay: false,
      };
      
    } catch (error) {
      console.error('Erreur lors de la génération de l\'entraînement du jour:', error);
      return null;
    }
  }

  private static async getSessionsCountSince(date: Date): Promise<number> {
    try {
      const history = await StorageService.getWorkoutHistory();
      return history.filter((session: any) => 
        new Date(session.date) >= date && session.completed
      ).length;
    } catch (error) {
      console.error('Erreur lors du calcul des séances:', error);
      return 0;
    }
  }

  static estimateWorkoutDuration(exercises: WorkoutExercise[]): number {
    let totalMinutes = 0;

    exercises.forEach(exercise => {
      if (exercise.type === 'strength') {
        const sets = exercise.targetSets || 3;
        totalMinutes += sets * 2.5;
      } else {
        const duration = exercise.targetDuration 
          ? parseInt(exercise.targetDuration.replace(/\D/g, '')) || 20
          : 20;
        totalMinutes += duration;
      }
    });

    totalMinutes += 10;
    return Math.round(totalMinutes);
  }

  static async getWorkoutStats(): Promise<WorkoutStats> {
    try {
      const history = await StorageService.getWorkoutHistory();
      
      const totalSessions = history.filter((session: any) => session.completed).length;
      const totalDuration = history.reduce((sum: number, session: any) => 
        sum + (session.duration || 0), 0
      );
      const averageDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

      let totalSets = 0;
      let totalReps = 0;
      const exerciseCount: { [key: number]: number } = {};

      history.forEach((session: any) => {
        session.exercises.forEach((exercise: any) => {
          totalSets += exercise.sets?.length || 0;
          totalSets += exercise.cardioSessions?.length || 0;

          exercise.sets?.forEach((set: any) => {
            totalReps += set.reps || 0;
          });

          exerciseCount[exercise.exerciseId] = (exerciseCount[exercise.exerciseId] || 0) + 1;
        });
      });

      const favoriteExercises = Object.entries(exerciseCount)
        .map(([id, count]) => ({ exerciseId: parseInt(id), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const { currentStreak, longestStreak } = this.calculateStreaks(history);

      return {
        totalSessions,
        totalDuration,
        averageDuration,
        currentStreak,
        longestStreak,
        totalSets,
        totalReps,
        favoriteExercises,
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageDuration: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalSets: 0,
        totalReps: 0,
        favoriteExercises: [],
      };
    }
  }

  private static calculateStreaks(history: any[]): { currentStreak: number; longestStreak: number } {
    if (history.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const sortedHistory = history
      .filter((session: any) => session.completed)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedHistory.length; i++) {
      const sessionDate = new Date(sortedHistory[i].date);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    let lastDate: Date | null = null;
    
    for (const session of sortedHistory) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      
      if (!lastDate || Math.floor((lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)) <= 2) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
      
      lastDate = sessionDate;
    }

    return { currentStreak, longestStreak };
  }
}

export default WorkoutService;