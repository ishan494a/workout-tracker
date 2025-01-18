import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  HomeScreen: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
interface Props {
  navigation: HomeScreenNavigationProp;
}
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await AsyncStorage.removeItem('jwt_token');

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 200);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['rgba(4,2,37,1)', 'rgba(0,0,0,1)', 'rgb(4, 4, 67)', 'rgb(8, 0, 41)']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to the App! 🎉</Text>
        <Text style={styles.infoText}>You're logged in. Enjoy your workout journey!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'rgba(0,212,255,1)',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
