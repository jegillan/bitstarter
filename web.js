var express = require('express');

var app = express.createServer(express.logger());
var fs = require('fs');
var toprint = new Buffer(30);
toprint  = fs.readFileSync('index.html','utf8')
app.get('/', function(request, response) {
  response.send(toprint.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
