const express = require('express');

const Projects = require('../data/helpers/projectModel.js');

const router = express.Router();

// projects will .get all projects ('/')

// projects will .get individual project id ('/:id')

// projects will be .posted ('/')

// projects will .get actions id ('/:id/actions)

// projects id will be .delete ('/:id')

// projects id will be .updated ('/:id')

// custom middleware

router.get('/', (req, res) => {
	Projects.get()
		.then((projects) => {
			res.status(200).json(projects);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'Error retrieving the projects' });
		});
});

router.get('/:id', validateId, (req, res) => {
	Projects.get(req.projects)
		.then((projects) => {
			res.status(200).json(projects);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'Error retrieving the projects' });
		});
});

router.get('/:id/actions', validateId, (req, res) => {
	Projects.getProjectActions(req.params.id)
		.then((action) => {
			if (action) {
				res.status(200).json(action);
			} else {
				res.status(404).json({ message: 'The project with the specified ID does not exist.' });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'The acion information could not be retrieved.' });
		});
});

router.post('/:id/actions', validateId, validateActions,  (req, res) => {
    Projects.insert(req.body)
    .then((project) => {
        res.status(201).json(project);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: 'There was an error while saving the actions to the database' });
    });
});

router.post('/', validateProjects, (req, res) => {
	Projects.insert(req.body)
		.then((project) => {
			res.status(201).json(project);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'There was an error while saving the project to the database' });
		});
});

router.put('/:id', validateId, validateProjects, (req, res) => {
	Projects.update(req.params.id, req.body)
		.then((project) => {
				res.status(200).json(project);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'The project information could not be modified.' });
		});
});

router.delete('/:id', validateId, (req, res) => {
	Projects.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ message: 'The project has been deleted' });
			} else {
				res.status(404).json({ message: 'The project with the specified ID does not exist.' });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'Error removing the project' });
		});
});

//custom middleware

function validateId(req, res, next) {
	Projects.get(req.params.id).then((projects) => {
		if (!projects) {
			res.status(404).json({ message: 'projects id is missing' });
		} else {
			req.projects = req.params.id;
			next();
		}
	});
}

function validateProjects(req, res, next) {
	if (Object.keys(req.body).length === 0) {
		res.status(400).json({ message: 'projects data is missing' });
	} else if (!req.body.name || !req.body.description) {
		res.status(400).json({ message: 'name and description are required' });
	} else {
		return next();
	}
}

function validateActions(req, res, next) {
	if (Object.keys(req.body).length === 0) {
		res.status(400).json({ message: 'actions data is missing' });
	} else if (!req.body.notes || !req.body.description) {
		res.status(400).json({ message: 'notes and description are required' });
	} else {
		return next();
	}
}

module.exports = router;
