const jwt = require('jsonwebtoken');
const Template = require('../models/Template');
const exercisesController = require('./exerciseAPIController')
const mongoose = require('mongoose'); // Import mongoose to handle ObjectId conversion

const searchExercise = async (req, res) => {
  const { query } = req.query;
  try {
    const list = await exercisesController.search(query);
    if(!list){
      return res.status(400).json({message : "No matching exercises found"});
    }
    return res.status(200).json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({message : "Internal Server Error"});
  }
  
} 
const addTemplateController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token is required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, workouts } = req.body;

    const newTemplate = new Template({
      userId,
      name,
      workouts,
    });
    
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create template' });
  }
};

const viewExistingTemplates = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token is required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await Template.find({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to retrieve templates' });
  }
}

const deleteTemplate = async (req, res) => {
  const { id } = req.query; 
  if (!id) {
    return res.status(400).json({ message: 'Template ID is required' });
  }
  try {
    const deletedTemplate = await Template.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    return res.status(200).json({ message: 'Template deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete template' });
  }
}

const deleteWorkout = async (req, res) => {
  const { id, workoutId } = req.query;
  if (!id || !workoutId) {
    return res.status(400).json({ message: 'Template ID and WorkoutID required' });
  }

  try {
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const updatedWorkouts = template.workouts.filter(workout => workout._id.toString() !== workoutId);

    template.workouts = updatedWorkouts;
    await template.save(); 
    return res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete workout' });
  }
};


module.exports = {
  addTemplateController,
  searchExercise, viewExistingTemplates,
  deleteTemplate, deleteWorkout
}