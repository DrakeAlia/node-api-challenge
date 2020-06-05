const express = require('express');

const Projects = require('./data/helpers/projectModel.js');

const router = express.Router();

// projects will .get all projects ('/')

// projects will .get individual project id ('/:id')

// projects will be .posted ('/')

// projects will .get actions id ('/:id/actions)

// projects id will be .delete ('/:id')

// projects id will be .updated ('/:id')

// custom middleware

router.get('/', (req, res) => {
    Projects
      .get()
      .then(projects => {
        res.status(200).json(projects);
      })
      .catch(error => {
        res.status(500).json({ message: "Error retrieving the projects" });
      }); 
  });
  
  router.get('/:id', validateProjectId, (req, res) => {
    const { id } = req.params;
  
    Projects.get(id)
      .then(project => {
      res.status(200).json(project);
    });
  });
  
  router.post("/", validateProject, (req, res) => {
    Projects.insert(req.body)
      .then(project => {
        res.status(201).json({ success: 'A New Project was created!', project })
      })
      .catch(err => {
        res.status(500).json({ error: 'Sorry, try again!', err })
      })
  });
  
  router.put("/:id", validateProjectId, validateProject, (req, res) => {
    const { id } = req.params;
  
    Projects.update(id, req.body).then(project => {
      res.status(200).json({ success: "Info Updated!", info: req.body });
    });
  });
  
  router.delete("/:id", validateProjectId, (req, res) => {
    const { id } = req.params;
  
    Projects
      .get(id)
      .then(project => {
        project
          ? Projects
            .remove(id)
            .then(deleted => {
              deleted
                ? res.status(200).json({ success: `The Project ${id} was deleted!`, info: project }) : null
            })
          : null
      }); 
  });
  
  router.get("/:id/actions", validateProjectId, (req, res) => {
    const { id } = req.params;
  
    Projects.getProjectActions(id)
      .then(data => {
        data ? res.status(200).json(data) : null
      }) 
  });
  
  router.post("/:id/actions", validateProjectId,  (req, res) => {
    const { description, notes } = req.body;
    const project_id = req.params.id;
  
    Projects.get(project_id).then(action => {
      if (!action) {
        null;
      } else {
        let newAction = {
          description,
          notes,
          project_id,
        };
        Actions.insert(newAction).then(action => {
          res.status(201).json({ success: action }); 
        }); 
      } 
    }); 
  });

// middleware

const validateProjectId = (req, res, next) => {
	const { id } = req.params;
	Projects.get(id)
		.then((project) => {
			project ? req.project : res.status(404).json({ message: 'Project Does Not Exist!' });
		})
		.catch((err) => {
			res.status(500).json({ error: 'Sorry, try again!', err });
		});
	next();
};

const validateProject = (req, res, next) => {
	const { name, description } = req.body;
	Object.entries(req.body).length === 0
		? res.status(404).json({ message: 'No Project Data' })
		: !name || !description
			? res.status(400).json({ error: 'Missing required info. Please add a Name & Description!' })
			: next();
};

module.exports = router;
