import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ProgramStorageService, SavedProgram } from '../service/ProgramStorageService';

interface ProgramsListScreenProps {
  navigation?: any;
}

const ProgramsListScreen: React.FC<ProgramsListScreenProps> = ({ navigation }) => {
  const [programs, setPrograms] = useState<SavedProgram[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les programmes au démarrage
  useEffect(() => {
    loadPrograms();
  }, []);

  // Charger les programmes depuis le stockage
  const loadPrograms = async () => {
    try {
      const savedPrograms = await ProgramStorageService.getAllPrograms();
      console.log('Programmes chargés:', savedPrograms); // Debug
      setPrograms(savedPrograms);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
    }
  };

  // Rafraîchir la liste
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrograms();
    setRefreshing(false);
  };

  // Naviguer vers un programme (temporairement désactivé)
  const handleProgramPress = (program: SavedProgram) => {
    // Temporairement désactivé - on créera l'écran ProgramDetail plus tard
    console.log('Programme sélectionné:', program.name);
    // if (navigation) {
    //   navigation.navigate('ProgramDetail', { programId: program.id });
    // }
  };

  // Créer un nouveau programme
  const handleCreateProgram = () => {
    if (navigation) {
      navigation.navigate('Program');
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Programmes</Text>
        <Text style={styles.subtitle}>
          {programs.length} programme{programs.length > 1 ? 's' : ''} créé{programs.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Liste des programmes */}
      {programs.length === 0 ? (
        // État vide
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Aucun programme configuré</Text>
          <Text style={styles.emptyText}>
            Commencez par créer votre premier programme d'entraînement personnalisé !
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={handleCreateProgram}
          >
            <Text style={styles.emptyButtonText}>➕ Créer mon premier programme</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Liste des programmes
        <View style={styles.programsContainer}>
          {programs.map((program, index) => (
            <TouchableOpacity
              key={program.id}
              style={styles.programCard}
              onPress={() => handleProgramPress(program)}
            >
              <View style={styles.programHeader}>
                <Text style={styles.programName}>{program.name}</Text>
                <View style={styles.programBadge}>
                  <Text style={styles.programDays}>
                    {program.totalDays} jour{program.totalDays > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.programExercises}>
                {ProgramStorageService.getTotalExercisesCount(program)} exercices au total
              </Text>
              
              <Text style={styles.programDate}>
                Créé le {ProgramStorageService.formatCreatedDate(program.createdAt)}
              </Text>

              {/* Aperçu des exercices */}
              <View style={styles.exercisePreviewContainer}>
                {program.days.slice(0, 2).map((day, dayIndex) => (
                  <Text key={dayIndex} style={styles.exercisePreview}>
                    Jour {day.day}: {day.selectedExercises.slice(0, 2).map(ex => ex.name).join(', ')}
                    {day.selectedExercises.length > 2 && ` +${day.selectedExercises.length - 2} autres`}
                  </Text>
                ))}
                {program.days.length > 2 && (
                  <Text style={styles.exercisePreview}>
                    +{program.days.length - 2} jour{program.days.length > 3 ? 's' : ''} supplémentaire{program.days.length > 3 ? 's' : ''}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bouton pour créer un nouveau programme */}
      {programs.length > 0 && (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateProgram}
        >
          <Text style={styles.createButtonText}>➕ Créer nouveau programme</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  
  // État vide
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Liste des programmes
  programsContainer: {
    padding: 15,
  },
  programCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  programBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  programDays: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  programExercises: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  programDate: {
    fontSize: 12,
    color: '#adb5bd',
    marginBottom: 15,
  },
  
  // Aperçu des exercices
  exercisePreviewContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  exercisePreview: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 3,
  },
  
  // Bouton créer
  createButton: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ProgramsListScreen;