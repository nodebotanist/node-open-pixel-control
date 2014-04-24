var EventEmitter = require("events").EventEmitter,
    util = require('util'),
    net = require('net');

function OPC(opts){
  if(!(this instanceof OPC)){
    return new OPC(opts);
  }
  //Add Event emitter methods
  EventEmitter.call(this);

  //set up server properties
  this.address = opts.address;
  this.port = opts.port;
  this.opc_client = null;
  this.strips = [];
}

//LEAVE THIS HERE- if you put extensions after this they will vanish
//because of the way inheritance in node works.
util.inherits(OPC, EventEmitter);

OPC.prototype.connect = function(){
  var self = this;
  self.opc_client = net.connect({
      port: self.port,
      address: self.address || '127.0.0.1'
    },
    function() {
      self.emit('connected');
  });

  self.opc_client.on('end', function(){
    self.emit('disconnected');
  });
};

OPC.prototype.disconnect = function(){
  var self = this;

  if(self.opc_client === null){
    throw new Error('You need to connect a board to disconnect it.');
  } else {
    self.opc_client.end(function(){
      //the socket is set up to emit a 'disconnected' event already, so no need to add it here.
    });
  }
};

OPC.prototype.addStrip = function(opts){
  if(!opts.length){
    throw new Error('you need to specify a length for an LED strip');
  }

  var strip_number = this.strips.length;

  //TODO: Add case when there are too many strips?

  this.strips.push({
    id: strip_number,
    length: opts.length,
    lo_byte: (opts.length * 3) % 256,
    hi_byte: parseInt((opts.length * 3) / 256, 10)
  });

  //return the strip ID in case it's needed
  return strip_number;
};

OPC.prototype.put_pixels = function(strip_id, pixels){
  var self = this,
      message = assemble_opc_message(this.strips[strip_id], pixels);

  this.opc_client.write(message, function(){
    self.emit('data_sent');
  });
};

function assemble_opc_message(strip, pixels){
  //assemble our OPC message header
  var header = String.fromCharCode(strip.id) + String.fromCharCode(0) + String.fromCharCode(strip.hi_byte) + String.fromCharCode(strip.lo_byte);
  var message_pixels = new Uint8ClampedArray(strip.length * 3);
  for(var i = 0; i < strip.length; i++){
      message_pixels[i*3] = pixels[i][0];
      message_pixels[(i*3)+1] = pixels[i][1];
      message_pixels[(i*3)+2] = pixels[i][2];
  }
  var message = new Buffer(header);
  message = Buffer.concat([message, new Buffer(message_pixels)]);
  return message;
}


module.exports = OPC;
