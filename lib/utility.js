// Middleware for authorization

exports.authorizeSocketClient = function (socket, next) {
  var handshakeData = socket.request;

  if (handshakeData._query.foo !== 'bar') {
    console.log('Unauthorized');
    console.log('Invalid secret: ' + handshakeData._query.foo);
    return next(new Error('not authorized'));
  }
  next();
};
