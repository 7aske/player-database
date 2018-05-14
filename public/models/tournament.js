const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		tName: { type: String, required: true },
		tPrize: { type: Number, default: 100 },
		tPlayers: [mongoose.Schema.Types.ObjectId]
	},
	{
		collection: 'tournaments'
	}
);
module.exports = mongoose.model('Tournament', tournamentSchema);
