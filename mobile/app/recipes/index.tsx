import { View, Text, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SwipeDeck from '@/components/SwipeDeck';

export default function RecipesPage() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View>
        <Image source={require('../../assets/bingeLogo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.subtitle}>
        <Text style={styles.bold}>Swipe</Text> ← <Text style={styles.bold}>left</Text> to skip  |  Swipe <Text style={styles.bold}>right</Text> → to like
      </Text>
      <SwipeDeck />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logo: {
    marginTop: 8,
    height: 128,
    width: 200,
  },
  subtitle: {
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
    color: '#3b82f6',
  },
  bold: {
    fontWeight: 'bold',
  },
});
