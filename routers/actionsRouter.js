const express = require('express');

const Actions = require('../data/helpers/actiontModel.js');

const router = express.Router();

// actions will .get all actions ('/')

// actions will .get individual action id ('/:id')

// action id will be .delete ('/:id')

// action id will be .updated ('/:id')

// custom middleware

// Gets
router.get('/', (req, res) => {
	Actions.get()
		.then((action) => {
			res.status(200).json(action);
		})
		.catch((err) => {
			res.status(500).json({ error: 'Sorry, try again!', err });
		});
});

router.get('/:id', validateActionId, (req, res) => {
	const { id } = req.params;

	Actions.get(id).then((action) => {
		res.status(200).json(action);
	});
});

// Puts
router.put('/:id', validateActionId, validateAction, (req, res) => {
	const { id } = req.params;

	Actions.update(id, req.body).then((action) => {
		res.status(200).json({ success: 'Info Updated!', info: req.body });
	});
});

// Post
router.post('/', validateAction, (req, res) => {
	Actions.insert(req.body)
		.then((action) => {
			res.status(201).json({ success: 'A New Action was created!', action });
		})
		.catch((err) => {
			res.status(500).json({ error: 'Sorry, try again!', err });
		});
});

// Delete
router.delete('/:id', validateActionId, (req, res) => {
	const { id } = req.params;

	Actions.get(id).then((action) => {
		action
			? Actions.remove(id).then((deleted) => {
					deleted ? res.status(200).json({ success: `Project ${id} was deleted!`, info: action }) : null;
				})
			: null;
	});
});

// middleware

const validateActionId = (req, res, next) => {
	const { id } = req.params;
	Actions.get(id)
		.then((action) => {
			action ? req.action : res.status(404).json({ message: 'Action Does Not Exist!' });
		})
		.catch((err) => {
			res.status(500).json({ error: 'Sorry, try again!', err });
		});
	next();
};

const validateAction = (req, res, next) => {
	const { description, notes } = req.body;
	Object.entries(req.body).length === 0
		? res.status(404).json({ message: 'No Action Data' })
		: !description || !notes
			? res.status(400).json({ message: 'Missing required info. Please add the description and notes!' })
			: next();
};

module.exports = router;
