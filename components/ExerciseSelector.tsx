import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { EXERCISES_DATABASE } from '../src/data/exercises';

interface ExerciseSelectorProps {
  category: string;
  currentDay: number;
  totalDays: number;
  selectedExercises: number[];
  onExerciseToggle: (exerciseId: number) => void;
  onDayComplete: () => void;
  onBackToCategories: () => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  category,
  currentDay,
  totalDays,
  selectedExercises,
  onExerciseToggle,
  onDayComplete,
  onBackToCategories,
}) => {
  const [selectedForViewing, setSelectedForViewing] = useState<number | null>(null);

  // Filtrer les exercices par catégorie
  const exercisesInCategory = EXERCISES_DATABASE.filter(
    exercise => exercise.category === category
  );

  // Pour l'instant, utiliser seulement le GIF qui existe
  const getExerciseGif = (exerciseId: number) => {
    // Utiliser le seul GIF qu'on sait qui existe pour tous les exercices
    return require('../assets/images/exercises/pompes_inclinees.gif');
  };

  const handleExercisePress = (exerciseId: number) => {
    if (selectedForViewing === exerciseId) {
      // Si déjà sélectionné pour voir, on toggle la sélection
      onExerciseToggle(exerciseId);
      setSelectedForViewing(null);
    } else {
      // Sinon on l'affiche pour voir le GIF
      setSelectedForViewing(exerciseId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackToCategories}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Changer de catégorie</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Jour {currentDay} / {totalDays}</Text>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.subtitle}>
          {selectedExercises.length} exercice{selectedExercises.length > 1 ? 's' : ''} sélectionné{selectedExercises.length > 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {exercisesInCategory.map((exercise) => {
          const isSelected = selectedExercises.includes(exercise.id);
          const isViewing = selectedForViewing === exercise.id;
          
          return (
            <View key={exercise.id}>
              <TouchableOpacity
                style={[
                  styles.exerciseCard,
                  isSelected && styles.selectedCard,
                  isViewing && styles.viewingCard
                ]}
                onPress={() => handleExercisePress(exercise.id)}
                activeOpacity={0.7}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, isSelected && styles.selectedText]}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.targetSets} séries • {exercise.targetReps} rép.
                  </Text>
                  <Text style={styles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                </View>
                
                <View style={styles.statusContainer}>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                  <Text style={styles.tapHint}>
                    {isViewing ? 'Appuyez pour sélectionner' : 'Appuyez pour voir'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Affichage du GIF quand sélectionné pour voir */}
              {isViewing && (
                <View style={styles.gifContainer}>
                  <Text style={styles.gifTitle}>{exercise.name}</Text>
                  <Image
                    source={getExerciseGif(exercise.id)}
                    style={styles.exerciseGif}
                    resizeMode="contain"
                  />
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.selectButton]}
                      onPress={() => {
                        onExerciseToggle(exercise.id);
                        setSelectedForViewing(null);
                      }}
                    >
                      <Text style={styles.selectButtonText}>
                        {isSelected ? '✓ Désélectionner' : '+ Sélectionner'}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, styles.closeButton]}
                      onPress={() => setSelectedForViewing(null)}
                    >
                      <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {selectedExercises.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onDayComplete}
          >
            <Text style={styles.continueButtonText}>
              {currentDay < totalDays ? `Continuer au Jour ${currentDay + 1}` : 'Créer le programme'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  viewingCard: {
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedText: {
    color: '#007AFF',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  statusContainer: {
    width: 80,
    alignItems: 'center',
  },
  checkmark: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tapHint: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  gifContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gifTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  exerciseGif: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: '#007AFF',
  },
  closeButton: {
    backgroundColor: '#666',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExerciseSelector;