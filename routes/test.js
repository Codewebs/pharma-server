 var express = require("express");
var router = express.Router();
var conn = require('../cnx');

var filename = 'lastCheck.png'
const [,, imagePath] = process.argv;

var fs = require('fs');


router.post('/upload', (req, res) => {

  
console.log("testo")
  
})


module.exports = router;  
