import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ProgramDaysSelectorProps {
  onSelectDays: (days: number) => void;
}

const ProgramDaysSelector: React.FC<ProgramDaysSelectorProps> = ({ onSelectDays }) => {
  const dayOptions = [1, 2, 3, 4];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un nouveau programme</Text>
      <Text style={styles.subtitle}>Combien de jours d'entraînement par semaine ?</Text>
      
      <View style={styles.optionsContainer}>
        {dayOptions.map((days) => (
          <TouchableOpacity
            key={days}
            style={styles.dayOption}
            onPress={() => onSelectDays(days)}
            activeOpacity={0.7}
          >
            <Text style={styles.dayNumber}>{days}</Text>
            <Text style={styles.dayText}>jour{days > 1 ? 's' : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayOption: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProgramDaysSelector;