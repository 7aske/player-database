const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		tName: { type: String, required: true },
		tPrize: { type: Number, default: 0 },
		//list of playerID's that are the reference to actual players in players collection
		tPlayers: [mongoose.Schema.Types.ObjectId]
	},
	{
		//define the collection in which tournaments are stored
		collection: 'tournaments'
	}
);
module.exports = mongoose.model('Tournament', tournamentSchema);
