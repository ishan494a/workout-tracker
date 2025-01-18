import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Validator from '../utils/Validator.js';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  HomeScreen: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleLogin = async () => {
    const usernameError = Validator.validateInput(username, 'username');
    
    if (usernameError) {
      setErrorMessage(usernameError);
      return;
    }
    
    setIsLoading(true); 
    try {
      const res = await fetch('http://192.168.2.19:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const { token } = data;
        setErrorMessage('');
        await AsyncStorage.setItem('jwt_token', token);
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Login</Text>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="rgba(255,255,255,0.7)"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="rgba(255,255,255,0.7)"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.registerText}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Register' }],
          });
        }}
      >
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,         
    fontWeight: 'bold',  
    color: '#fff',        
    textAlign: 'center',  
    marginBottom: 40,     
    letterSpacing: 1.2,   
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000', // Solid black background
    paddingHorizontal: 20,
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
  registerButton: {
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
  registerText: {
    marginTop: 0,
    textAlign: 'center',
    color: 'rgba(0,212,255,1)',
    fontSize: 16,
  }
});

export default LoginScreen;
