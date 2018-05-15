const express = require('express');
const router = express.Router();
const path = require('path');

//root
router.get('/', (req, res) => {
	res.status(200).render('index');
});

//had troubles with handlebars and therefore I routed css file manually
router.get('/css/style.css', (req, res) => {
	res.status(200).sendFile(path.join(__dirname, 'public/views/css/style.css'));
});
router.get('/tournaments/css/style.css', (req, res) => {
	res.status(200).sendFile(path.join(__dirname, 'public/views/css/style.css'));
});

//route for a specific tournament
router.get('/tournaments/:tournamentId', (req, res) => {
	res.status(200).render('tournament');
});

module.exports = router;
