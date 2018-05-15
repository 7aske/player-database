//import required modules
const express = require('express');
const server = express(); //init server
const router = require('./router');
const api = require('./api');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const url = require('url');

//connecting to mongodb atlas with mongoose
const uri =
	'mongodb+srv://admin:hello123@cluster0-rsmz5.mongodb.net/tournaments';
mongoose
	.connect(uri)
	.then()
	.catch(err => console.log(err));

//define port
const port = process.env.PORT || 3000;

//make static files available for serving
server.use(express.static('public'));

//set up body parser middleware
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

//set up pesky handlebars
//note: there is a diference between forward and backward slashes
//depending on the operating system the server is running on
server.set('views', __dirname + '/public/views/layouts');
server.engine(
	'handlebars',
	exphbs({
		extname: '.handlebars',
		defaultLayout: 'main.handlebars',
		layoutsDir: __dirname + '/public/views/layouts',
		partialsDir: __dirname + '/public/views/layouts'
	})
);
server.set('view engine', 'handlebars');

//define routes for /api and root
//using different module for api routes
//to increase readiblity
server.use('/api', api);
server.use('/', router);

//listen for connections on the defined port
server.listen(port, () => {
	console.log(`Server running on port ${port}.`);
});
