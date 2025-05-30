import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { EXERCISE_CATEGORIES } from '../src/data/exercises';

interface CategorySelectorProps {
  currentDay: number;
  totalDays: number;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  currentDay, 
  totalDays, 
  onSelectCategory 
}) => {
  const categories = [
    { key: EXERCISE_CATEGORIES.CHEST, name: 'Pectoraux', icon: '💪' },
    { key: EXERCISE_CATEGORIES.BACK, name: 'Dos', icon: '🏋️' },
    { key: EXERCISE_CATEGORIES.SHOULDERS, name: 'Épaules', icon: '🤸' },
    { key: EXERCISE_CATEGORIES.ARMS, name: 'Bras', icon: '💪' },
    { key: EXERCISE_CATEGORIES.LEGS, name: 'Jambes', icon: '🦵' },
    { key: EXERCISE_CATEGORIES.CORE, name: 'Core', icon: '🔥' },
    { key: EXERCISE_CATEGORIES.CARDIO, name: 'Cardio', icon: '❤️' },
    { key: EXERCISE_CATEGORIES.FULL_BODY, name: 'Full Body', icon: '🏃' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jour {currentDay} / {totalDays}</Text>
        <Text style={styles.subtitle}>Choisissez une catégorie musculaire</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={styles.categoryCard}
              onPress={() => onSelectCategory(category.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  categoriesGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    marginBottom: 15,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default CategorySelector;