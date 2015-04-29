// Require dependencies
var app        = require('express')();
var http       = require('http').Server(app);
var io         = require('socket.io')(http);
var morgan     = require('morgan');
var port       = 3002;
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var utility    = require('./lib/utility');
var Beacon     = require('./lib/beacon');

// Configure express middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(utility.authenticateRequest);

// mongodb connectivity
mongoose.connect('mongodb://localhost/epic_music_app');

// Seed data
utility.seedData();

// Configure socket.io middleware for authorization
io.use(utility.authorizeSocketClient);

// Routes
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/beacons/:uuid', function(req, res) {
  var beacon = Beacon.find({ uuid: req.params.uuid }, function(err, beacons) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    if (beacons.length > 0) {
      // io.emit('interaction_one', news.toJson());
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
  socket.emit('interaction_one', { message: 'connected successfully' });
});

// Start server
http.listen(port, function() {
  console.log('Server listening at port %d', port);
});
