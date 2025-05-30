import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const ExerciseImageTest = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test d'affichage des GIFs d'exercices</Text>
      
      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseName}>Pompes inclinées</Text>
        
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/exercises/pompes_inclinees.gif')}
            style={styles.exerciseImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.description}>
          Version plus facile des pompes, idéale pour débuter.
        </Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Séries : </Text>
          <Text style={styles.infoValue}>3</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Répétitions : </Text>
          <Text style={styles.infoValue}>12-20</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
  },
  exerciseImage: {
    width: 200,
    height: 200,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default ExerciseImageTest;