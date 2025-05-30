import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CURRENT_PROGRAM: 'currentProgram',
  WORKOUT_HISTORY: 'workoutHistory',
  USER_SETTINGS: 'userSettings',
  WEEKLY_SCHEDULE: 'weeklySchedule',
};

class StorageService {
  
  // ========== PROGRAMME D'ENTRAÎNEMENT ==========
  
  static async saveProgram(program: any) {
    try {
      const programData = {
        ...program,
        lastModified: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_PROGRAM, 
        JSON.stringify(programData)
      );
      
      await this.generateWeeklySchedule(program);
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du programme:', error);
      throw error;
    }
  }

  static async getCurrentProgram() {
    try {
      const programData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PROGRAM);
      return programData ? JSON.parse(programData) : null;
    } catch (error) {
      console.error('Erreur lors du chargement du programme:', error);
      return null;
    }
  }

  static async deleteCurrentProgram() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_PROGRAM);
      await AsyncStorage.removeItem(STORAGE_KEYS.WEEKLY_SCHEDULE);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du programme:', error);
      throw error;
    }
  }

  // ========== PLANNING HEBDOMADAIRE ==========

  static async generateWeeklySchedule(program: any) {
    try {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
      
      const schedule = [];
      const { frequency, type } = program;
      const workoutDays = this.getWorkoutDays(frequency);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        const isWorkoutDay = workoutDays.includes(i + 1);
        
        if (isWorkoutDay) {
          const workoutIndex = workoutDays.indexOf(i + 1);
          let programDay = 'A';
          
          if (type === 'alternating') {
            programDay = workoutIndex % 2 === 0 ? 'A' : 'B';
          }
          
          schedule.push({
            date: date.toISOString(),
            isWorkoutDay: true,
            programDay,
            completed: false,
          });
        } else {
          schedule.push({
            date: date.toISOString(),
            isWorkoutDay: false,
            programDay: null,
            completed: false,
          });
        }
      }
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.WEEKLY_SCHEDULE, 
        JSON.stringify(schedule)
      );
      
      return schedule;
    } catch (error) {
      console.error('Erreur lors de la génération du planning:', error);
      throw error;
    }
  }

  static getWorkoutDays(frequency: number) {
    const schedules: { [key: number]: number[] } = {
      2: [1, 4], // Lundi, Jeudi
      3: [1, 3, 5], // Lundi, Mercredi, Vendredi
      4: [1, 2, 4, 5], // Lundi, Mardi, Jeudi, Vendredi
    };
    
    return schedules[frequency] || schedules[3];
  }

  static async getWeeklySchedule() {
    try {
      const scheduleData = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_SCHEDULE);
      return scheduleData ? JSON.parse(scheduleData) : [];
    } catch (error) {
      console.error('Erreur lors du chargement du planning:', error);
      return [];
    }
  }

  // ========== HISTORIQUE DES SÉANCES ==========

  static async saveWorkoutSession(workoutSession: any) {
    try {
      const history = await this.getWorkoutHistory();
      
      const sessionData = {
        ...workoutSession,
        id: workoutSession.id || Date.now(),
        savedAt: new Date().toISOString(),
      };
      
      history.unshift(sessionData);
      
      if (history.length > 100) {
        history.splice(100);
      }
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.WORKOUT_HISTORY, 
        JSON.stringify(history)
      );
      
      await this.markDayAsCompleted(workoutSession.date);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la séance:', error);
      throw error;
    }
  }

  static async getWorkoutHistory() {
    try {
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      return [];
    }
  }

  static async markDayAsCompleted(date: string) {
    try {
      const schedule = await this.getWeeklySchedule();
      const dayToUpdate = schedule.find((day: any) => 
        day.date.split('T')[0] === date.split('T')[0]
      );
      
      if (dayToUpdate) {
        dayToUpdate.completed = true;
        await AsyncStorage.setItem(
          STORAGE_KEYS.WEEKLY_SCHEDULE, 
          JSON.stringify(schedule)
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du planning:', error);
    }
  }

  // ========== STATISTIQUES ==========

  static async getWeeklyStats() {
    try {
      const schedule = await this.getWeeklySchedule();
      const history = await this.getWorkoutHistory();
      
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const plannedWorkouts = schedule.filter((day: any) => day.isWorkoutDay).length;
      const completedWorkouts = schedule.filter((day: any) => 
        day.isWorkoutDay && day.completed
      ).length;
      
      const weeklyHistory = history.filter((session: any) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      
      const totalDuration = weeklyHistory.reduce((sum: number, session: any) => 
        sum + (session.duration || 0), 0
      );
      
      const totalSets = weeklyHistory.reduce((sum: number, session: any) => 
        sum + session.exercises.reduce((exerciseSum: number, exercise: any) => 
          exerciseSum + (exercise.sets?.length || 0) + (exercise.cardioSessions?.length || 0), 0
        ), 0
      );
      
      return {
        planned: plannedWorkouts,
        completed: completedWorkouts,
        progress: plannedWorkouts > 0 ? (completedWorkouts / plannedWorkouts) * 100 : 0,
        totalDuration,
        totalSets,
        weeklyHistory,
      };
      
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return {
        planned: 0,
        completed: 0,
        progress: 0,
        totalDuration: 0,
        totalSets: 0,
        weeklyHistory: [],
      };
    }
  }
}

export default StorageService;