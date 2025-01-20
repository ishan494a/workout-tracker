import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;
interface WorkoutScreenProps {
  route: any;
  navigation: any;
}

const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ route, navigation }) => {
  const { template } = route.params;
  const [workouts, setWorkouts] = useState(template?.workouts || []);
  const [sets, setSets] = useState<any>({});

  // Handle the addition of a row for a specific exercise
  const handleAddRow = (exerciseId: string) => {
    setSets((prevSets) => ({
      ...prevSets,
      [exerciseId]: [...(prevSets[exerciseId] || []), { reps: '', lbs: '' }],
    }));
  };

  // Handle changes in sets and lbs
  const handleSetChange = (exerciseId: string, index: number, field: string, value: string) => {
    const updatedSets = [...(sets[exerciseId] || [])];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    setSets((prevSets) => ({ ...prevSets, [exerciseId]: updatedSets }));
  };

  const handleFinishWorkout = () => {
    console.log(sets);
    navigation.navigate('HomeScreen');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.screenText}>{template?.name} Workout</Text>

      <ScrollView style={styles.scrollContainer}>
        {workouts.map((exercise: any, index: number) => (
          <View key={exercise._id || index} style={styles.card}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>

            {sets[exercise._id]?.map((row: any, rowIndex: number) => (
              <View key={rowIndex} style={styles.row}>
                <TextInput
                  style={styles.input}
                  placeholder="Lbs"
                  keyboardType="numeric"
                  value={row.lbs}
                  onChangeText={(value) => handleSetChange(exercise._id, rowIndex, 'lbs', value)}
                />
                <Text style={styles.crossText}>X</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Reps"
                  keyboardType="numeric"
                  value={row.reps}
                  onChangeText={(value) => handleSetChange(exercise._id, rowIndex, 'reps', value)}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddRow(exercise._id)}
            >
              <Text style={styles.buttonText}>Add Row</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.finishButton} onPress={handleFinishWorkout}>
          <Text style={styles.buttonText}>Finish Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#000', // Dark background for contrast
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(16, 32, 75, 0.1)', // Card background color
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  exerciseName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth:1,
    borderColor: 'rgb(75, 75, 75)',
    width: '45%',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#00D4FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  crossText: {
    paddingTop: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  finishButton: {
    backgroundColor: '#28A746',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
});

export default WorkoutScreen;
