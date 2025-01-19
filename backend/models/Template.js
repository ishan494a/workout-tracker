const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: String,
  bodyPart: String,
  equipment: String,
  gifUrl: String,
  id: String,
  target: String,
  secondaryMuscles: [String],
});

const templateSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true,
  },
  name: { type: String, required: true },
  workouts: [workoutSchema],
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
