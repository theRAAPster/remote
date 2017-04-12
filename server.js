// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var net        = require('net');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var GC_SERVER_HOST = '192.168.1.50';
var GC_SERVER_PORT = 4998;

var elementMuteAction = '1,38000,1,69,342,171,21,21,21,21,21,64,21,21,21,21,21,21,21,21,21,21,21,64,21,64,21,21,21,64,21,64,21,64,21,64,21,64,21,64,21,21,21,21,21,64,21,21,21,21,21,21,21,21,21,21,21,64,21,64,21,21,21,64,21,64,21,64,21,64,21,1517,342,86,21,3654';
var elementPowerAction = '1,38000,1,69,342,171,21,21,21,21,21,64,21,21,21,21,21,21,21,21,21,21,21,64,21,64,21,21,21,64,21,64,21,64,21,64,21,64,21,21,21,21,21,21,21,64,21,21,21,21,21,21,21,21,21,64,21,64,21,64,21,21,21,64,21,64,21,64,21,64,21,1517,342,85,21,3654';
var elementVolumeUpAction = '1,38000,1,69,341,172,21,21,21,21,21,64,21,21,21,21,21,21,21,21,21,21,21,64,21,64,21,21,21,64,21,64,21,64,21,64,21,64,21,21,21,64,21,21,21,21,21,21,21,21,21,21,21,21,21,64,21,21,21,64,21,64,21,64,21,64,21,64,21,64,21,1518,341,86,21,3654';
var elementVolumeDownAction = '1,38000,1,69,341,172,21,21,21,21,21,64,21,21,21,21,21,21,21,21,21,21,21,64,21,64,21,21,21,64,21,64,21,64,21,64,21,64,21,64,21,64,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,64,21,64,21,64,21,64,21,64,21,64,21,1518,341,86,21,3654';
var elementInputScroll = '1,38000,1,69,342,170,20,20,20,64,20,20,20,20,20,20,20,20,20,20,20,20,20,64,20,20,20,64,20,64,20,64,20,64,20,64,20,20,20,64,20,64,20,20,20,64,20,20,20,20,20,64,20,20,20,20,20,20,20,64,20,20,20,64,20,64,20,20,20,64,20,1558,342,85,20,3650';

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    //console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
router.route('/element/:id/:command')
    .post(function(req, res) {
      switch(req.params.id) {
        case 'left':
          var connectorAddress = '4:2';
          break;
        case 'right':
          var connectorAddress = '4:1';
          break;
      }

      switch (req.params.command) {
        case 'mute':
          var action = elementMuteAction;
          break;
        case 'power':
          var action = elementPowerAction;
          break;
        case 'volumeup':
          var action = elementVolumeUpAction;
          break;
        case 'volumedown':
          var action = elementVolumeDownAction;
          break;
        case 'inputscroll':
          var action = elementInputScroll;
          break;
      }
      sendIR(connectorAddress, action, res)
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

function sendIR(connectorAddress, action, res) {
  var client = new net.Socket();
  var command = 'sendir,' + connectorAddress + ',' + action + '\r'
  client.connect(GC_SERVER_PORT, GC_SERVER_HOST, function() {
      console.log('CONNECTED TO: ' + GC_SERVER_HOST + ':' + GC_SERVER_PORT);
      // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
      console.log('Sending: ' + command);
      client.write(command);
  });

  // Add a 'data' event handler for the client socket
  // data is what the server sent to this socket
  client.on('data', function(data) {
      console.log('Response: ' + data);
      res.send(data);
      // Close the client socket completely
      client.destroy();
  });

  // Add a 'close' event handler for the client socket
  client.on('close', function() {
      console.log('Connection closed');
  });
};

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
