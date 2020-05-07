//const webpack = require('webpack');
//const middleware = require('webpack-dev-middleware');
var express = require("express");
var path = require("path");
//const cors = require('cors');
//const webpackConfig = require('./webpack.config.dev');
var bodyParser = require("body-parser"); 
var formidable = require('express-formidable')
const swaggerUi = require('swagger-ui-express');

var logger = require("morgan");
var swaggerJSDoc = require("swagger-jsdoc");

var passport = require("passport");
var helmet = require("helmet");

var Cors = require("cors");



var test = require("./routes/test");


//USERS MANAGER ROUTES

//const compiler = webpack(webpackConfig);



var app = express();
var port = process.env.PORT || 4000
var socket_io = require("socket.io");
var io = socket_io();
//Vues
 
/*app.set("views",  path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
/* **************************************************************** */
//Definir le dossier de recuperation des images envoyées par RN
/*app.use(formidable({
	uploadDir: 'assets/docs'
})); */
/* **************************************************************** */
//app.use(cors());
//app.use('/', express.static(path.resolve(__dirname, '..')));
//app.use(middleware(compiler, { publicPath: '/dist' }));
const swaggerDefinition = {
  info: {
    title: 'MySQL Registration Swagger API',
    version: '1.0.0',
    description: 'Endpoints to test the user registration routes',
  },
  host: 'localhost:3003',
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {  
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

require('./config/passport');

const whitelist = [
  "http://192.168.137.104:8081",
  "http://localhost:4000/",
  "http://localhost:3001/",

  'http://localhost:3003',
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//app.use(Cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:false}));

app.use(logger('dev'));
app.use(helmet());
app.use(passport.initialize());
//Routes

app.use("/api", test);



require('./routes/pharmacies')(app); // Contient toutes les operations sur les pharmacies
require('./routes/categories')(app); // Contient toutes les operations sur les categories
require('./routes/products')(app); // Contient toutes les operations sur les produits

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('IPV4adress: '+add);
})

io.listen(app.listen(port, function(){
	console.log("Server Port : ", port);
})); 

app.io = io.on("connection", function(socket){
  //console.log(socket)
  //var clients = io.sockets.clients();
      //console.log(clients.server.clients())

  socket.join("notification")    
  io.emit("notification", "Qu'allez vous manger aujourd'hui ?"); 
	console.log("One new Socket connecté:" + socket.id);

/* setInterval(function(){
  console.log("Je veux ta position")
    io.emit('livreurs',"please, position")  
  }, 15000);
  */
  
  io.on('ma position', function(){
     console.log('-----------')
  })

}); 


