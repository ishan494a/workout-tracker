import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Button,
  Image,
  ScrollView,
} from 'react-native';

const TemplateScreen = () => {
  const [exerciseList, setExerciseList] = useState<{ name: string; gifUrl: string }[]>([]);
  const [templateList, setTemplateList] = useState<any[]>([]); // Store templates here
  const [modalVisible, setModalVisible] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);
  const [addedExercises, setAddedExercises] = useState<any[]>([]); 

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
  const renderTemplateCard = (template: any) => {
    const handleTemplateClick = () => {
      // Navigate to a workout page
    }
    return (
      <TouchableOpacity
        key={template._id}
        style={styles.card}
        onPress={handleTemplateClick}
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
      const res = await fetch('http://192.168.2.19:8080/templates/existingtemplates', {
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
        const res = await fetch(`http://192.168.2.19:8080/templates/search?query=${query}`, {
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
            name: exercise.name.replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalizing each word's first letter
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
      const res = await fetch(`http://192.168.2.19:8080/templates/addTemplate`, {
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
                    <Text style={styles.addButtonText}>
                      {addedExercises.some((addedExercise) => addedExercise.id === item.id) ? 'Added!' : 'Add to Template'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveTemplate}>
                <Text style={styles.saveButtonText}>Save Template</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Close</Text>
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
  workoutText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
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
    marginTop: 20,
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
    alignItems: 'center', // Aligning items within each exercise box
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
  addButton: {
    backgroundColor: 'rgba(0,212,255,1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  addedButton: {
    backgroundColor: 'rgb(16, 189, 19)', // Green when added
  },
  addButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

