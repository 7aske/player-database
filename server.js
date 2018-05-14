const express = require('express');
const server = express();
const api = require('./api');
const router = require('./router');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const url = require('url');

const publicPath = path.join(__dirname, '/public/views');
console.log(publicPath);

const uri =
	'mongodb+srv://admin:hello123@cluster0-rsmz5.mongodb.net/tournaments';
mongoose
	.connect(uri)
	.then()
	.catch(err => console.log(err));

const port = process.env.PORT || 3000;

server.use(express.static('public'));

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.set('views', __dirname + '\\public\\views\\layouts');
server.engine(
	'handlebars',
	exphbs({
		extname: '.handlebars',
		defaultLayout: 'main.handlebars',
		layoutsDir: __dirname + '\\public\\views\\layouts',
		partialsDir: __dirname + '\\public\\views\\layouts'
	})
);
server.set('view engine', 'handlebars');

console.log(server.get('views'));

server.use('/api', api);
server.use('/', router);
server.listen(port, () => {
	console.log(`Server running on port ${port}.`);
});
