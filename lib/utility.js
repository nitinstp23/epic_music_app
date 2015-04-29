// Middleware for authorization

var Beacon = require('./beacon');
var secret = 'very_secret_token';

exports.authorizeSocketClient = function(socket, next) {
  var handshakeData = socket.request;

  if (handshakeData._query.foo !== 'bar') {
    console.log('Unauthorized');
    console.log('Invalid secret: ' + handshakeData._query.foo);
    return next(new Error('not authorized'));
  }
  next();
};

exports.authenticateRequest = function(req, res, next) {
  if (secret !== req.headers['x-access-token']) {
    return res.status(401).json({ error: 'Invalid x-access-token' });
  }
  next();
}

// Create beacons
exports.seedData = function() {
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
        messages: [{type: '1', message: 'Immediate proximity'},
                   {type: '2', message: 'Near proximity'},
                   {type: '3', message: 'Far proximity'}]
      });

      beacon.save(function(err) {
        if (err) throw err;
        console.log('beacon created');
      });
    }
  });
}
