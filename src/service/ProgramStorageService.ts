import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExercisesByIds } from '../data/exercises';

export interface SavedProgram {
  id: string;
  name: string;
  totalDays: number;
  createdAt: string;
  days: ProgramDay[];
}

export interface ProgramDay {
  day: number;
  selectedExercises: number[];
}

const PROGRAMS_STORAGE_KEY = 'fitness_programs';

export class ProgramStorageService {
  // Sauvegarder un nouveau programme
  static async saveProgram(programDays: ProgramDay[], totalDays: number, name?: string): Promise<SavedProgram> {
    try {
      const programs = await this.getAllPrograms();
      
      const newProgram: SavedProgram = {
        id: Date.now().toString(),
        name: name || `Programme ${totalDays} jour${totalDays > 1 ? 's' : ''}`,
        totalDays,
        createdAt: new Date().toISOString(),
        days: programDays,
      };

      programs.push(newProgram);
      await AsyncStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(programs));
      
      return newProgram;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  // Récupérer tous les programmes
  static async getAllPrograms(): Promise<SavedProgram[]> {
    try {
      const programsJson = await AsyncStorage.getItem(PROGRAMS_STORAGE_KEY);
      return programsJson ? JSON.parse(programsJson) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      return [];
    }
  }

  // Récupérer un programme par ID
  static async getProgramById(id: string): Promise<SavedProgram | null> {
    try {
      const programs = await this.getAllPrograms();
      return programs.find(program => program.id === id) || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du programme:', error);
      return null;
    }
  }

  // Supprimer un programme
  static async deleteProgram(id: string): Promise<void> {
    try {
      const programs = await this.getAllPrograms();
      const filteredPrograms = programs.filter(program => program.id !== id);
      await AsyncStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(filteredPrograms));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }

  // Mettre à jour un programme
  static async updateProgram(updatedProgram: SavedProgram): Promise<void> {
    try {
      const programs = await this.getAllPrograms();
      const index = programs.findIndex(program => program.id === updatedProgram.id);
      
      if (index !== -1) {
        programs[index] = updatedProgram;
        await AsyncStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(programs));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  }

  // Obtenir le nombre d'exercices d'un programme
  static getTotalExercisesCount(program: SavedProgram): number {
    return program.days.reduce((total, day) => total + day.selectedExercises.length, 0);
  }

  // Obtenir les détails des exercices d'un jour
  static getDayExercisesDetails(dayExercises: number[]) {
    return getExercisesByIds(dayExercises);
  }

  // Formater la date de création
  static formatCreatedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}