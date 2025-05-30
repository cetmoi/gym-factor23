import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ImageBackground, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    // Animation de pulsation pour le logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animation d'entrée pour le contenu
    const slideAnimation = Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    });

    pulseAnimation.start();
    slideAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const motivationalQuotes = [
    "Pousse-toi plus fort que tes excuses",
    "Chaque rep te rapproche de ton objectif", 
    "La force vient de la volonté",
    "Aujourd'hui, tu choisis d'être plus fort"
  ];

  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ImageBackground
        source={require('./assets/images/gym.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            {/* Header avec logo GO FORT ME */}
            <Animated.View style={[styles.logoSection, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.logoMain}>GO FORT</Text>
              <Text style={styles.logoAccent}>ME</Text>
            </Animated.View>

            {/* Citation motivante */}
            <Animated.View style={[styles.quoteSection, { transform: [{ translateY: slideAnim }] }]}>
              <Text style={styles.quoteText}>"{currentQuote}"</Text>
            </Animated.View>

            {/* Défi du jour */}
            <View style={styles.challengeSection}>
              <View style={styles.challengeHeader}>
                <View style={styles.fireIcon}></View>
                <Text style={styles.challengeTitle}>DÉFI DU JOUR</Text>
              </View>
              <TouchableOpacity style={styles.challengeCard}>
                <Text style={styles.challengeText}>100 POMPES CHALLENGE</Text>
                <Text style={styles.challengeSubtext}>Divise en 5 séries de 20</Text>
                <View style={styles.challengeProgress}>
                  <Text style={styles.progressLabel}>Progression: 40/100</Text>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}></View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Actions Rapides Énergiques */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>🚀 ACTIONS POWER</Text>
              
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={[styles.actionButton, styles.actionPrimary]}>
                  <View style={styles.actionIconLarge}></View>
                  <Text style={styles.actionTextLarge}>COMMENCER</Text>
                  <Text style={styles.actionSubtext}>L'ENTRAÎNEMENT</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.actionButton, styles.actionSecondary]}>
                  <View style={styles.actionIcon}></View>
                  <Text style={styles.actionText}>MES PROGRAMMES</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.actionButton, styles.actionSecondary]}>
                  <View style={styles.actionIcon}></View>
                  <Text style={styles.actionText}>TESTS FORCE</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Motivantes */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>💪 TON PARCOURS</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>23</Text>
                  <Text style={styles.statLabel}>JOURS DE SUITE</Text>
                  <Text style={styles.statEmoji}>🔥</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>156</Text>
                  <Text style={styles.statLabel}>WORKOUTS TOTAL</Text>
                  <Text style={styles.statEmoji}>💯</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>+15kg</Text>
                  <Text style={styles.statLabel}>PROGRESSION</Text>
                  <Text style={styles.statEmoji}>📈</Text>
                </View>
              </View>
            </View>

            {/* Section Motivation */}
            <View style={styles.motivationSection}>
              <Text style={styles.sectionTitle}>⚡ BOOST TON MENTAL</Text>
              
              <TouchableOpacity style={styles.motivationCard}>
                <Text style={styles.motivationTitle}>🎵 PLAYLIST BEAST MODE</Text>
                <Text style={styles.motivationText}>44 tracks pour te motiver</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.motivationCard}>
                <Text style={styles.motivationTitle}>🏆 SUCCESS STORIES</Text>
                <Text style={styles.motivationText}>Témoignages inspirants</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacer}></View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoMain: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FF0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 3,
  },
  logoAccent: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF0000',
    marginTop: -8,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 8,
  },
  quoteSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  challengeSection: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#FF0000',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  fireIcon: {
    width: 25,
    height: 25,
    backgroundColor: '#FF4500',
    borderRadius: 12,
    marginRight: 10,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  challengeCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 15,
  },
  challengeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF0000',
    marginBottom: 5,
  },
  challengeSubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 10,
  },
  challengeProgress: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FF0000',
    borderRadius: 4,
    width: '40%',
  },
  actionsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionPrimary: {
    backgroundColor: '#FF0000',
    borderColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 25,
    shadowColor: '#FF0000',
  },
  actionSecondary: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#FF0000',
    width: '48%',
    shadowColor: '#000',
  },
  actionIconLarge: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginBottom: 10,
  },
  actionIcon: {
    width: 35,
    height: 35,
    backgroundColor: '#FF0000',
    borderRadius: 17,
    marginBottom: 8,
  },
  actionTextLarge: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 15,
    flex: 0.3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF0000',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  statEmoji: {
    fontSize: 20,
  },
  motivationSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  motivationCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF0000',
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  motivationText: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  bottomSpacer: {
    height: 40,
  },
});