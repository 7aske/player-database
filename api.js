const router = require('express').Router();
const mongoose = require('mongoose');
const Tournament = require('./public/models/tournament');
const randomID = require('random-id');

router.get('/tournaments', (req, res) => {
	Tournament.find({})
		.exec()
		.then(docs => res.status(200).send(docs))
		.catch(err => res.status(500).send({ error: err }));
});
router.get('/tournaments/:tournamentId', (req, res) => {
	const tId = req.params.tournamentId;
	Tournament.findOne({ _id: tId })
		.exec()
		.then(tournament => res.status(200).send(tournament))
		.catch(err => res.status(500).send({ error: err }));
});
router.get('/tournaments/:tournamentId/players', (req, res) => {
	const tId = req.params.tournamentId;
	Tournament.findOne({ _id: tId })
		.exec()
		.then(tournament => res.status(200).send(tournament.tPlayers))
		.catch(err => res.status(500).send({ error: err }));
});
router.get('/tournaments/:tournamentId/players/:playerId', (req, res) => {
	const tId = req.params.tournamentId;
	const pId = req.params.playerId;
	Tournament.findOne({ _id: tId })
		.exec()
		.then(tournament => {
			let data;
			tournament.tPlayers.forEach(player => {
				if (player._id == pId) data = player;
			});
			data ? res.status(200).send(data) : res.status(404).send({});
		})
		.catch((err, msg) => res.status(500).send({ error: err }));
});

router.post('/tournaments', (req, res) => {
	const tournament = new Tournament({
		_id: new mongoose.Types.ObjectId(randomID(24, '0').toString()),
		tName: req.body.tName,
		tPlayers: req.body.tPlayers
	});
	tournament
		.save()
		.then(result => {
			res.status(201).send(result);
		})
		.catch(err => res.status(500).send({ error: err }));
});
router.post('/tournaments/:tournamentId/players', (req, res) => {
	const tId = req.params.tournamentId;
	const newPlayer = {
		_id: new mongoose.Types.ObjectId(randomID(24, '0').toString()),
		pFirstName: req.body.pFirstName,
		pLastName: req.body.pLastName,
		pBirthDate: new Date(),
		pImage: req.body.pImage,
		pPoints: req.body.pPoints
	};
	Tournament.update(
		{ _id: tId },
		{
			$push: {
				tPlayers: newPlayer
			}
		}
	)
		.exec()
		.then(result => {
			res.status(201).send(result);
		})
		.catch(err => res.status(500).send({ error: err }));
});
router.delete('/tournaments/:tournamentId', (req, res) => {
	const tId = req.params.tournamentId;
	Tournament.findOneAndRemove({ _id: tId })
		.exec()
		.then(result => res.status(200).send(result))
		.catch(err => res.status(500).send(err));
});
router.delete('/tournaments/:tournamentId/players/:playerId', (req, res) => {
	const tId = req.params.tournamentId;
	const pId = req.params.playerId;
	let tPlayersNew = [];
	Tournament.findOne({ _id: tId })
		.exec()
		.then(tournament => {
			tournament.tPlayers.forEach(player => {
				if (player._id != pId) tPlayersNew.push(player);
			});
			Tournament.update(
				{ _id: tId },
				{
					$set: {
						tPlayers: tPlayersNew
					}
				}
			)
				.exec()
				.then(result => res.status(200).send(result))
				.catch(err => res.status(500).send({ error: err }));
		})
		.catch(err => res.status(500).send({ error: err }));
});
router.patch('/tournaments/:tournamentId/players/:playerId', (req, res) => {
	const tId = req.params.tournamentId;
	const pId = req.params.playerId;
	const patchPlayer = {
		_id: new mongoose.Types.ObjectId(pId),
		pFirstName: req.body.pFirstName,
		pLastName: req.body.pLastName,
		pBirthDate: new Date(),
		pImage: req.body.pImage,
		pPoints: req.body.pPoints
	};
	let tPlayersNew = [];
	Tournament.findOne({ _id: tId })
		.exec()
		.then(tournament => {
			tournament.tPlayers.forEach(player => {
				if (player._id != pId) tPlayersNew.push(player);
				else tPlayersNew.push(patchPlayer);
			});
			Tournament.update(
				{ _id: Id },
				{
					$set: {
						tPlayers: tPlayersNew
					}
				}
			)
				.exec()
				.then(result => res.status(200).send(result))
				.catch(err => res.status(500).send({ error: err }));
		})
		.catch(err => res.status(500).send({ error: err }));
});
module.exports = router;
