const express = require('express');

const Actions = require('../data/helpers/actionModel.js');

const router = express.Router();

// actions will .get all actions ('/')

// actions will .get individual action id ('/:id')

// action id will be .delete ('/:id')

// action id will be .updated ('/:id')

// custom middleware

router.get('/', (req, res) => {
	Actions.get()
		.then((actions) => {
			res.status(200).json(actions);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'Error retrieving the actions' });
		});
});

router.get('/:id', validateId, (req, res) => {
	Actions.get(req.actions)
		.then((actions) => {
			res.status(200).json(actions);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'Error retrieving the actions' });
		});
});

router.put('/:id', validateActions, validateId, (req, res) => {
	Actions.update(req.params.id, req.body)
		.then((actions) => {
				res.status(200).json(actions);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'Error updating the action' });
		});
});

router.delete('/:id', validateId, (req, res) => {
	Actions.remove(req.params.id)
		.then((count) => {
				res.status(200).json({ message: 'The action has been deleted' });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'Error removing the action' });
		});
});

//custom middleware

function validateId(req, res, next) {
    Actions.get(req.params.id)
      .then(actions => {
        if (!actions) {
          res.status(404).json({ message: "actions id is invaild"});
        } else {
           req.actions = req.params.id;
           next();
        }
      })
  }
  
  function validateActions(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ message: 'actions data is missing'})
    } else if (!req.body.notes || !req.body.description) {
      res.status(400).json({ message: 'notes and description are required'})
    } else {
      return next()
      }
    }


module.exports = router;
