const mongoose = require('mongoose');
const playerSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	pFirstName: { type: String, required: true },
	pLastName: { type: String, required: true },
	pBirthDate: { type: Date, default: new Date() },
	pImage: { type: String, default: 'sample image' },
	pPro: { type: Boolean, default: false },
	pPoints: { type: Number, default: 0 }
});

const tournamentSchema = new mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		tName: { type: String, required: true },
		tPlayers: Array
	},
	{
		collection: 'tournaments'
	}
);
module.exports = mongoose.model('Tournament', tournamentSchema);
