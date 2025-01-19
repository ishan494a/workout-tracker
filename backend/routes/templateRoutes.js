const TemplateController = require('../controllers/TemplateController.js');
const express = require('express');
const router = express.Router();

router.post('/addTemplate', TemplateController.addTemplateController);
router.get('/search', TemplateController.searchExercise);
router.get('/existingtemplates', TemplateController.viewExistingTemplates);

module.exports = router;