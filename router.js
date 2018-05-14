const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
	res.status(200).render('index');
});
router.get('/css/style.css', (req, res) => {
	res.status(200).sendFile(path.join(__dirname, 'public/views/css/style.css'));
});
router.get('/tournaments/css/style.css', (req, res) => {
	res.status(200).sendFile(path.join(__dirname, 'public/views/css/style.css'));
});

router.get('/tournaments/:tournamentId', (req, res) => {
	res.status(200).render('tournament');
});

module.exports = router;
