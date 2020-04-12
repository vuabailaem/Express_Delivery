const Project = require('../Models/project.model');

module.exports = {
    index: (req, res, next) => {
        res.status(200).json({
            message: 'You requested'
        });
    },

    newProject: (req, res, next) => {
        const newProject = new Project(req.body);
        newProject.save()
            .then(project => {
                res.status(201).json(project);
            })
            .catch()
    },
}