import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'; // For tab icons
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import LogScreen from '../components/LogScreen';
import StatsScreen from '../components/StatsScreen';
import HistoryScreen from '../components/HistoryScreen';

const ProfileScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);

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
    <View style={styles.screen}>
      <Text style={styles.screenText}>Profile Page</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName : 'person' | 'event' | 'bar-chart' | 'history' = 'person';
          if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Log') {
            iconName = 'event';
          } else if (route.name === 'Stats') {
            iconName = 'bar-chart';
          } else if (route.name === 'History'){
            iconName = 'history';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'rgb(0, 213, 255)',
        tabBarInactiveTintColor: 'white',           
        tabBarStyle: {
          backgroundColor: 'rgb(1, 6, 15)',
          paddingBottom: 10,
          borderTopWidth: 0,
          shadowOpacity: 0.3,
        }, 
        headerShown: false,
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Log" component={LogScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
};

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

export default HomeScreen;
