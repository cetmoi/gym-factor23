import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const CreateProgramScreen = ({ navigation }) => {
  const [selectedDays, setSelectedDays] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const dayOptions = [
    { value: 1, label: '1 jour' },
    { value: 2, label: '2 jours' },
    { value: 3, label: '3 jours' },
    { value: 4, label: '4 jours' },
  ];

  const handleDaySelection = (days) => {
    setSelectedDays(days);
  };

  const handleCreateProgram = () => {
    if (!selectedDays) {
      Alert.alert('Attention', 'Veuillez sélectionner le nombre de jours d\'entraînement.');
      return;
    }

    setIsCreating(true);

    // Simuler la création du programme
    setTimeout(() => {
      setIsCreating(false);
      
      // Message de succès et retour
      Alert.alert(
        'Programme créé !',
        `Votre programme de ${selectedDays} jour${selectedDays > 1 ? 's' : ''} a été créé avec succès.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Retour simple qui DOIT marcher
              navigation.goBack();
            }
          }
        ]
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.questionSection}>
          <Text style={styles.mainTitle}>Créer un nouveau programme</Text>
          <Text style={styles.questionText}>
            Combien de jours d'entraînement par semaine ?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {dayOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                selectedDays === option.value && styles.optionCardSelected
              ]}
              onPress={() => handleDaySelection(option.value)}
            >
              <Text style={[
                styles.optionNumber,
                selectedDays === option.value && styles.optionNumberSelected
              ]}>
                {option.value}
              </Text>
              <Text style={[
                styles.optionLabel,
                selectedDays === option.value && styles.optionLabelSelected
              ]}>
                {option.label.split(' ')[1]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.createButton,
              !selectedDays && styles.createButtonDisabled,
              isCreating && styles.createButtonCreating
            ]}
            onPress={handleCreateProgram}
            disabled={!selectedDays || isCreating}
          >
            <Text style={styles.createButtonText}>
              {isCreating ? 'Création en cours...' : 'Créer le programme'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 0.22,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  optionNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  optionNumberSelected: {
    color: '#1976D2',
  },
  optionLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 50,
  },
  createButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonCreating: {
    backgroundColor: '#1976D2',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

export default CreateProgramScreen;