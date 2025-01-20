import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WorkoutScreen from '../screens/WorkoutScreen';
import Constants from 'expo-constants';
const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
const TemplateScreen: React.FC<any> = ({ navigation }) => {
  const [exerciseList, setExerciseList] = useState<{ name: string; gifUrl: string }[]>([]);
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [addWorkoutModalVisible, setAddWorkoutModalBVisible] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);
  const [template, setTemplate] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [addedExercises, setAddedExercises] = useState<any[]>([]); 
  
  const handleStartWorkout = () => {
    setTemplateModalVisible(false);
    navigation.navigate('Workout', { template }); 
  };


  // Function to fetch templates from AsyncStorage
  const fetchExercise = async () => {
    try {
      const storedExercise = await AsyncStorage.getItem('exercise_list');
      if (storedExercise) {
        setExerciseList(JSON.parse(storedExercise));
      }
    } catch (error) {
      console.error('Error fetching templates from AsyncStorage:', error);
    }
  };
  function handleTemplateClick (template: any) {
    setTemplate(template);
    setWorkouts(template.workouts)
    setTemplateModalVisible(true);
  }
  const handleCloseTemplateModal = () => {
    setTemplate([]);
    setWorkouts([]);
    setTemplateModalVisible(false);
  }
  const handleDeleteExercise = async (templateId: any, exerciseId: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/templates/deleteworkout?id=${templateId}&workoutId=${exerciseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        setWorkouts(prevList => prevList.filter(workout => workout._id !== exerciseId));
        fetchTemplates();
      } else {
        alert("Try Again");
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleDeleteTemplate = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/templates/deletetemplate?id=${template._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json',
        }});
        if(res.ok){
          setTemplateList(prevList => prevList.filter(t => t._id !== template._id));
          setTemplateModalVisible(false);
          fetchTemplates();
        } else {
          alert("Try Again")
        }
    } catch (err) {
      console.error(err);
    }
  }
  const renderTemplateCard = (template: any) => {
    return (
      <TouchableOpacity
        key={template._id}
        style={styles.card}
        onPress={() => handleTemplateClick(template)}
      >
        <Text style={styles.cardTitle}>{template.name}</Text>
        <ScrollView style={styles.workoutList}>
          {template.workouts.length > 0 ? (
            template.workouts.map((workout: any, index: number) => (
              <Text key={index} style={styles.workoutText}>{workout.name}</Text>
            ))
          ) : (
            <Text style={styles.workoutText}>No workouts available</Text>
          )}
        </ScrollView>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    fetchExercise();
  }, []);
  // Fetch existing templates from the backend
  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/templates/existingtemplates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTemplateList(data); // Store the fetched templates
      } else {
        console.log('Error fetching templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    fetchTemplates(); // Fetch templates when the screen loads
  }, []);

  const handleCreateTemplate = () => {
    setModalVisible(true);
  };

  const handleSearchExercise = async () => {
    const query = searchQuery.toLowerCase();
    if (query) {
      try {
        const res = await fetch(`${BACKEND_URL}/templates/search?query=${query}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          const exerciseData = data.map((exercise: any) => ({
            bodyPart: exercise.bodyPart,
            equipment: exercise.equipment,
            gifUrl: exercise.gifUrl,
            id: exercise.id,
            name: exercise.name.replace(/\b\w/g, (char) => char.toUpperCase()),
            target: exercise.target,
            secondaryMuscles: exercise.secondaryMuscles,
          }));          
          setExercises(exerciseData);
        } else {
          const errorData = await res.json();
          console.log(errorData);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddToTemplate = (exercise: { name: string; gifUrl: string }) => {
    const isAdded = addedExercises.some((addedExercise) => addedExercise.id === exercise.id);
    if (isAdded) {
      setAddedExercises(addedExercises.filter((addedExercise) => addedExercise.id !== exercise.id));
    } else {
      setAddedExercises([...addedExercises, exercise]);
    }
  };
  const addWorkoutModal = () => {
    console.log("adding")
  } 
  const handleSaveTemplate = async () => {
    if (!templateName) {
      alert("Template Name Required!");
      return;
    }
    setTemplateName('');
    setModalVisible(false);
    setSearchQuery('');
    setExercises([]);
    const data = addedExercises;
    setAddedExercises([]);

    const requestBody = {
      name: templateName,
      workouts: data
    };
  
    // Call the backend to store in MongoDB
    try {
      const res = await fetch(`${BACKEND_URL}/templates/addTemplate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (res.ok) {
        fetchTemplates(); 
      } else {
        const errorData = await res.json();
        console.log(errorData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  // Handle closing the modal
  const handleCloseModal = async () => {
    await AsyncStorage.removeItem('exercise_list');
    setExerciseList([]);
    setSearchQuery('');
    setExercises([]);
    setAddedExercises([]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <TouchableOpacity style={styles.button} onPress={handleCreateTemplate}>
          <Text style={styles.buttonText}>Create New Template</Text>
        </TouchableOpacity>
        <ScrollView style={styles.templateList}>
          {templateList.map(renderTemplateCard)}
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Template</Text>

            <TextInput
              style={styles.input}
              placeholder="Template Name"
              value={templateName}
              onChangeText={setTemplateName}
              placeholderTextColor="rgba(255,255,255,0.7)"
            />

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search Exercises"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="rgba(255,255,255,0.7)"
                onSubmitEditing={handleSearchExercise}
              />
            </View>

            <ScrollView style={styles.exerciseList} horizontal>
              {exercises.map((item, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseText}>{item.name}</Text>
                  {item.gifUrl && (
                    <Image source={{ uri: item.gifUrl }} style={styles.exerciseImage} />
                  )}
                  <TouchableOpacity
                    style={[styles.addButton, addedExercises.some((addedExercise) => addedExercise.id === item.id) ? styles.addedButton : null]}
                    onPress={() => handleAddToTemplate(item)}
                  >
                  {addedExercises.some((addedExercise) => addedExercise.id === item.id) ? <MaterialCommunityIcons name="check" size={25} color="#fff" /> : <MaterialCommunityIcons name="plus" size={25} color="#fff" />}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveTemplate}>
              <MaterialCommunityIcons name="content-save" size={25} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <MaterialCommunityIcons name="close" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={templateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseTemplateModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{template.name}</Text>
            <ScrollView style={styles.modalExerciseList}>
              {workouts.map((exercise, index) => (
                <View key={exercise._id || index} style={styles.exerciseRow}>
                  <Image source={{ uri: exercise.gifUrl }} style={styles.exerciseRowImage} />
                  <Text style={styles.workoutText}>{exercise.name}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteExercise(template._id ,exercise._id)}
                  >
                    <MaterialCommunityIcons name="trash-can" size={25} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleStartWorkout}>
              <MaterialCommunityIcons name="play" size={25} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteTemplate}
                  >
                    <MaterialCommunityIcons name="trash-can" size={35} color="#fff" />
                  </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseTemplateModal}>
              <MaterialCommunityIcons name="close" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TemplateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(0, 0, 0)',
  },
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgb(0, 0, 0)',
    padding: 20,
  },
  button: {
    backgroundColor: 'rgba(0,212,255,1)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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
  templateList: {
    marginTop: 20,
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(16, 32, 75, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutList: {
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    backgroundColor: 'rgb(0, 0, 0)',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  exerciseList: {
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  exerciseItem: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  exerciseText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  exerciseImage: {
    width: 70,
    height: 70,
    marginTop: 10,
    borderRadius: 8,
  },
  addWorkoutButton: {
    backgroundColor: 'rgb(0, 119, 255)',
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: 'rgb(0, 119, 255)',
    paddingVertical: 8,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginTop: 10,
  },
  addedButton: {
    backgroundColor: 'rgb(16, 189, 19)',
  },
  addButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalButtons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  saveButton: {
    backgroundColor: 'rgba(0,212,255,1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 99, 71, 1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalExerciseList: {
    width: '100%',
    maxHeight: 400,
    marginTop: 10,
    
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(133, 133, 133, 0.07)',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
  },
  exerciseRowImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 8,
  },
  workoutText: {
    color: '#fff',
    fontSize: 16,
    flex: 1, 
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 99, 71, 1)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

