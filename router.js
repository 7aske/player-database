const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
	res.render('index');
});
router.get('/css/style.css', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/views/css/style.css'));
});
router.get('/tournaments/css/style.css', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/views/css/style.css'));
});

router.get('/tournaments/:tournamentId', (req, res) => {
	res.render('tournament');
});
router.get('/tournaments/:tournamentId/players/:playerId', (req, res) => {
	res.render('player');
});

module.exports = router;
