import { View, Text, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function ProfilePage() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View>
        <Image source={require('../../assets/bingeLogo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.message}>
        Your Liked Recipes and Your Profile will be here! (This page is under construction)
      </Text>
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
  message: {
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
    color: '#3b82f6',
  },
});
