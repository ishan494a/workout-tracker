import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const LogScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenText}>Log Page</Text>
  </View>
);

export default LogScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(0, 0, 0)'
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(0,212,255,1)',
    paddingVertical: 15,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
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
