// Import dependencies
const express = require('express');
const router = express.Router();

const ProjectsController = require('../controllers/projects.controller');

// Content
// Note: not Localhost:8888/ , true: localhost:8888/projects/
router.route('/')
    .get(ProjectsController.index)

// Export module
module.exports = router;