var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// create a schema
var beaconSchema = new Schema({
  uuid: { type: String, required: true },
  major: { type: String, required: true },
  minor: { type: String, required: true },
  messages: { type: Array, default: [] }
});

beaconSchema.method('toJson', function(msg_type) {
  var selected_message = {};

  for(i=0; i < this.messages.length; i++) {
    if (this.messages[i].type == msg_type) {
      selected_message = this.messages[i];
      break;
    };
  };

  return {
    uuid: this.uuid,
    major: this.major,
    minor: this.minor,
    message: selected_message
  };
});

var Beacon = mongoose.model('Beacon', beaconSchema);

module.exports = Beacon;
