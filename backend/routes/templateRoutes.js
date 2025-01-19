const TemplateController = require('../controllers/TemplateController.js');
const express = require('express');
const router = express.Router();

router.post('/addtemplate', TemplateController.addTemplateController);
router.get('/search', TemplateController.searchExercise);
router.get('/existingtemplates', TemplateController.viewExistingTemplates);
router.delete('/deletetemplate', TemplateController.deleteTemplate);
router.delete('/deleteworkout', TemplateController.deleteWorkout);

module.exports = router;