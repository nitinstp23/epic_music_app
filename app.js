// Require dependencies
var app        = require('express')();
var http       = require('http').Server(app);
var io         = require('socket.io')(http);
var morgan     = require('morgan');
var port       = 3002;
var secret     = 'very_secret_token';
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var utility    = require('./lib/utility');
var Beacon     = require('./lib/beacon');

// Configure express middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongodb connectivity
mongoose.connect('mongodb://localhost/epic_music_app');

// Configure socket.io middleware for authorization
io.use(utility.authorizeSocketClient);

// Routes
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/beacons/:uuid', function(req, res) {
  if (secret !== req.headers['x-access-token']) {
    return res.status(401).json({ error: 'Invalid x-access-token' });
  }

  var beacon = Beacon.find({ uuid: req.params.uuid }, function(err, beacons) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    if (beacons.length > 0) {
      // io.emit('news', news.toJson());
      var proximity = req.query.proximity;
      return res.json(beacons[0].toJson(proximity));
    } else{
      return res.sendStatus(404);
    };
  });
});

// Socket.io event wiring
io.on('connection', function (socket) {
  console.log("Connected!");
  socket.emit('news', { username: 'nitin', message: 'Coming soon...' });
});


// Create beacons
var beacon_uuid = '123456789'
Beacon.find({ uuid: beacon_uuid }, function(err, beacons) {
  if (err) {
    console.log(err);
  }

  if (beacons.length == 0) {
    var beacon = Beacon({
      uuid: beacon_uuid,
      major: '123',
      minor: '456',
      messages: [{type: '1', message: 'Immediate proximity'}, {type: '2', message: 'Near proximity'}, {type: '3', message: 'Far proximity'}]
    });

    beacon.save(function(err) {
      if (err) throw err;
      console.log('beacon created');
    });
  }
});


// Start server
http.listen(port, function() {
  console.log('Server listening at port %d', port);
});
