const router = require('express').Router();
const mongoose = require('mongoose');

//mongoose models
const Players = require('./public/models/player');
const Tournaments = require('./public/models/tournament');

//default get ALL tournaments route
router.get('/tournaments', (req, res) => {
	Tournaments.find({})
		.exec()
		.then(tournaments => res.status(200).send(tournaments))
		.catch(err => res.status(500).send({ error: err }));
});

//get specific tournament along with its cooresponding players
router.get('/tournaments/:tournamentId', (req, res) => {
	const tId = req.params.tournamentId;
	Tournaments.findOne({ _id: tId })
		.exec()
		.then(tournament => {
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

//this is the same as the route above and I'm keeping it for possible future implementations
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

//get a specific player along with tournament that player is playing onended
//this was required in order to update the tournament player list
//in case of player deletion
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

//adding a tournament to the database
router.post('/tournaments', (req, res) => {
	//using mongoose model to define the tournament
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

//adding a player to the tournament and database
router.post('/tournaments/:tournamentId/players', (req, res) => {
	//using mongoose model to define the player
	const tId = req.params.tournamentId;
	const player = new Players({
		_id: new mongoose.Types.ObjectId(),
		pFirstName: req.body.pFirstName,
		pLastName: req.body.pLastName,
		pBirthDate: req.body.pBirthDate,
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
						tPlayers: result._id //add the player id to tournament player list for future reference
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

//delete the tournament
router.delete('/tournaments/:tournamentId', (req, res) => {
	const tId = req.params.tournamentId;
	Tournaments.findOneAndRemove({ _id: tId })
		.exec()
		.then(result => res.status(200).sendStatus(200))
		.catch(err => res.status(500).send({ error: err }));
});

//delete a player from players database and from its cooresponding tournament player list
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
				.then(result => res.status(200).sendStatus(200))
				.catch(err => res.status(500).send({ error: err }))
		)
		.catch(err => res.status(500).send({ error: err }));
});

//update the player with new details
router.put('/tournaments/:tournamentId/players/:playerId', (req, res) => {
	const pId = req.params.playerId;
	Players.findByIdAndUpdate(
		{ _id: pId },
		{
			pFirstName: req.body.pFirstName,
			pLastName: req.body.pLastName,
			pBirthDate: req.body.pBirthDate,
			//had issues with pictures actually being blank strings
			//null should trigger the default value from mongoose models
			pImage: req.body.pImage == '' ? null : req.body.pImage,
			pPoints: req.body.pPoints
		}
	)
		.exec()
		.then(result => res.status(201).sendStatus(201))
		.catch(err => res.status(500).send({ error: err }));
});
module.exports = router;
