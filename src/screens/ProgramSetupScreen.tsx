import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import ProgramDaysSelector from '../../components/ProgramDaysSelector';
import CategorySelector from '../../components/CategorySelector';
import ExerciseSelector from '../../components/ExerciseSelector';
import { ProgramStorageService } from '../service/ProgramStorageService';

type ProgramStep = 'days' | 'category' | 'exercises';

interface DayProgram {
  day: number;
  selectedExercises: number[];
}

interface ProgramSetupScreenProps {
  navigation?: any; // Pour la navigation entre écrans
}

const ProgramSetupScreen: React.FC<ProgramSetupScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<ProgramStep>('days');
  const [totalDays, setTotalDays] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [programDays, setProgramDays] = useState<DayProgram[]>([]);

  // Étape 1: Sélection du nombre de jours
  const handleSelectDays = (days: number) => {
    setTotalDays(days);
    setCurrentDay(1);
    setProgramDays(Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      selectedExercises: []
    })));
    setCurrentStep('category');
  };

  // Étape 2: Sélection de la catégorie
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentStep('exercises');
  };

  // Étape 3: Toggle exercice
  const handleExerciseToggle = (exerciseId: number) => {
    setProgramDays(prev => prev.map(dayProgram => {
      if (dayProgram.day === currentDay) {
        const isSelected = dayProgram.selectedExercises.includes(exerciseId);
        return {
          ...dayProgram,
          selectedExercises: isSelected
            ? dayProgram.selectedExercises.filter(id => id !== exerciseId)
            : [...dayProgram.selectedExercises, exerciseId]
        };
      }
      return dayProgram;
    }));
  };

  // Retour aux catégories depuis les exercices
  const handleBackToCategories = () => {
    setCurrentStep('category');
    setSelectedCategory('');
  };

  // Completion d'un jour
  const handleDayComplete = async () => {
    if (currentDay < totalDays) {
      // Passer au jour suivant
      setCurrentDay(currentDay + 1);
      setCurrentStep('category');
      setSelectedCategory('');
    } else {
      // Créer le programme complet
      console.log('Programme créé:', programDays);
      
      try {
        // Sauvegarder le programme dans AsyncStorage
        const savedProgram = await ProgramStorageService.saveProgram(programDays, totalDays);
        
        // Afficher un message de succès
        Alert.alert(
          'Programme créé !',
          `Votre programme "${savedProgram.name}" a été créé avec succès.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Réinitialiser l'état
                setCurrentStep('days');
                setCurrentDay(1);
                setTotalDays(0);
                setProgramDays([]);
                setSelectedCategory('');
                
                // Retourner à l'accueil si navigation disponible
                if (navigation) {
                  navigation.navigate('Home');
                }
              }
            }
          ]
        );
      } catch (error) {
        // En cas d'erreur de sauvegarde
        Alert.alert(
          'Erreur',
          'Impossible de sauvegarder le programme. Veuillez réessayer.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  // Obtenir les exercices sélectionnés pour le jour actuel
  const getCurrentDayExercises = () => {
    const currentDayProgram = programDays.find(day => day.day === currentDay);
    return currentDayProgram ? currentDayProgram.selectedExercises : [];
  };

  return (
    <View style={styles.container}>
      {currentStep === 'days' && (
        <ProgramDaysSelector onSelectDays={handleSelectDays} />
      )}
      
      {currentStep === 'category' && (
        <CategorySelector
          currentDay={currentDay}
          totalDays={totalDays}
          onSelectCategory={handleSelectCategory}
        />
      )}
      
      {currentStep === 'exercises' && (
        <ExerciseSelector
          category={selectedCategory}
          currentDay={currentDay}
          totalDays={totalDays}
          selectedExercises={getCurrentDayExercises()}
          onExerciseToggle={handleExerciseToggle}
          onDayComplete={handleDayComplete}
          onBackToCategories={handleBackToCategories}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ProgramSetupScreen;