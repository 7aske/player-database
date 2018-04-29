const express = require('express');
const server = express();
const api = require('./api');
const router = require('./router');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const url = require('url');

// const uri =
// 	'mongodb+srv://admin:hello123@cluster0-rsmz5.mongodb.net/tournaments';
const uri =
	'mongodb+srv://admin:hello123@cluster0-rsmz5.mongodb.net/tournaments';
mongoose
	.connect(uri)
	.then(result => console.log(result))
	.catch(err => console.log(err));

const port = process.env.PORT || 3000;

server.use(express.static('public'));

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.engine('handlebars', exphbs({ defaultLayout: 'main' }));
server.set('view engine', 'handlebars');
server.set('views', path.join(__dirname, 'views'));

server.use('/api', api);
server.use('/', router);
server.listen(port, () => {
	console.log(`Server running on port ${port}.`);
});
