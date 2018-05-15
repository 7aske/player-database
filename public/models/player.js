const mongoose = require('mongoose');
const path = require('path');
const playerSchema = new mongoose.Schema(
	{
		//this id will be referenced in tournament player list
		_id: mongoose.Schema.Types.ObjectId,
		pFirstName: { type: String, required: true },
		pLastName: { type: String, required: true },
		pBirthDate: { type: Date, default: new Date() }, //if the date is not entered default value will be the date of creation
		pImage: {
			type: String,
			default:
				//default blank sihloutte picture
				'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png'
		},
		pPoints: { type: Number, default: 0 }
	},
	{
		//define the collecton in which the player will be stored
		collection: 'players'
	}
);
module.exports = mongoose.model('Player', playerSchema);
