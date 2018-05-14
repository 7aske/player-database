const mongoose = require('mongoose');
const path = require('path');
const playerSchema = new mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		pFirstName: { type: String, required: true },
		pLastName: { type: String, required: true },
		pBirthDate: { type: Date, default: new Date() },
		pImage: {
			type: String,
			default:
				'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png'
		},
		pPoints: { type: Number, default: 0 }
	},
	{
		collection: 'players'
	}
);
module.exports = mongoose.model('Player', playerSchema);
