const router = require('express').Router();
const mongoose = require('mongoose');
const Players = require('./public/models/player');
const Tournaments = require('./public/models/tournament');

router.get('/tournaments', (req, res) => {
	Tournaments.find({})
		.exec()
		.then(tournaments => res.status(200).send(tournaments))
		.catch(err => res.status(500).send({ error: err }));
});
router.get('/tournaments/:tournamentId', (req, res) => {
	const tId = req.params.tournamentId;
	Tournaments.findOne({ _id: tId })
		.exec()
		.then(tournament => {
			console.log(tournament.tPlayers);
			Players.find()
				.where('_id')
				.in(tournament.tPlayers)
				.exec()
				.then(players =>
					res.status(200).send({ tournament: tournament, players: players })
				)
				.catch(err => res.status(500).send({ error: err }));
		})
		.catch(err => res.status(500).send({ error: err }));
});
router.get('/tournaments/:tournamentId/players', (req, res) => {
	const tId = req.params.tournamentId;
	Tournaments.findOne({ _id: tId })
		.exec()
		.then(tournament => {
			Players.find()
				.where('_id')
				.in(tournament.tPlayers)
				.exec()
				.then(players => {
					res.status(200).send({ tournament: tournament, players: players });
				})
				.catch(err => res.status(500).send({ error: err }));
		})
		.catch(err => res.status(500).send({ error: err }));
});
router.get('/tournaments/:tournamentId/players/:playerId', (req, res) => {
	const tId = req.params.tournamentId;
	const pId = req.params.playerId;
	Tournaments.findOne({ _id: tId })
		.exec()
		.then(tournament => {
			Players.findOne({ _id: pId })
				.exec()
				.then(player =>
					res.status(200).send({ tournament: tournament, player: player })
				)
				.catch(err => res.status(500).send({ error: err }));
		})
		.catch(err => res.status(500).send({ error: err }));
});

router.post('/tournaments', (req, res) => {
	const tournament = new Tournaments({
		_id: new mongoose.Types.ObjectId(),
		tName: req.body.tName,
		tPrize: req.body.tPrize,
		tPlayers: req.body.tPlayers
	});
	tournament
		.save()
		.then(result => {
			res.status(201).redirect('/');
		})
		.catch(err => res.status(500).send({ error: err }));
});
router.post('/tournaments/:tournamentId/players', (req, res) => {
	const tId = req.params.tournamentId;
	const player = new Players({
		_id: new mongoose.Types.ObjectId(),
		pFirstName: req.body.pFirstName,
		pLastName: req.body.pLastName,
		pBirthDate: new Date(),
		pImage: req.body.pImage,
		pPoints: req.body.pPoints
	});
	player
		.save()
		.then(result => {
			Tournaments.update(
				{ _id: tId },
				{
					$push: {
						tPlayers: result._id
					}
				}
			)
				.exec()
				.then(result => {
					res.status(201).send(result);
				})
				.catch(err => res.status(500).send({ error: err }));
		})
		.catch(err => res.status(500).send({ error: err }));
});
router.delete('/tournaments/:tournamentId', (req, res) => {
	const tId = req.params.tournamentId;
	Tournaments.findOneAndRemove({ _id: tId })
		.exec()
		.then(result => res.status(200).send(result))
		.catch(err => res.status(500).send(err));
});
router.delete('/tournaments/:tournamentId/players/:playerId', (req, res) => {
	const tId = req.params.tournamentId;
	const pId = req.params.playerId;
	Players.findOneAndRemove({ _id: pId })
		.exec()
		.then(
			Tournaments.findOneAndUpdate(
				{ _id: tId },
				{
					$pull: {
						tPlayers: pId
					}
				}
			)
				.exec()
				.then(result => res.status(200).send(result))
				.catch(err => res.status(500).send({ error: err }))
		)
		.catch(err => res.status(500).send({ error: err }));
});
router.put('/tournaments/:tournamentId/players/:playerId', (req, res) => {
	console.log(req.body);
	const pId = req.params.playerId;
	Players.findByIdAndUpdate(
		{ _id: pId },
		{
			pFirstName: req.body.pFirstName,
			pLastName: req.body.pLastName,
			pBirthDate: req.body.pBirthDate,
			pImage: req.body.pImage == '' ? null : req.body.pImage,
			pPoints: req.body.pPoints
		}
	)
		.exec()
		.then(result => res.status(201).sendStatus(201))
		.catch(err => res.status(500).send({ error: err }));
});
module.exports = router;
