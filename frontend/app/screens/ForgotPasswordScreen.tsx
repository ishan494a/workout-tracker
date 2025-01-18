import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  HomeScreen: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}
const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleForgotPassword = async () => {
    setIsLoading(true); // Start loading
    try {
      const res = await fetch('http://192.168.2.19:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setErrorMessage('');
        // Navigate to a confirmation screen or show a success message
        // navigation.navigate('PasswordResetConfirmation');
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['rgba(4,2,37,1)', 'rgba(0,0,0,1)', 'rgb(4, 4, 67)', 'rgb(8, 0, 41)']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
        <Text style={styles.title}>🛠️ Forgot Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="rgba(255,255,255,0.7)"
        />
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
        >
          <Text style={styles.backText}>Back to login</Text>
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
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 55,
    borderColor: 'rgba(142, 142, 161, 0.7)',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
  errorContainer: {
    padding: 15,
    backgroundColor: 'rgba(255, 77, 79, 0.9)',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    textAlign: 'center',
    marginBottom: 10,
    color: 'rgba(0,212,255,1)',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(0,212,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backText: {
    textAlign: 'center',
    color: 'rgba(0,212,255,1)',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
