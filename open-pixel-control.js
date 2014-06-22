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
    self.opc_client.end();
  }
};

OPC.prototype.add_strip = function(opts){
  if(!opts.length){
    throw new Error('you need to specify a length for an LED strip');
  }

  var strip_number = this.strips.length;

  //TODO: Add case when there are too many strips?
  //init strip
  var new_pixels = [];
  for(var i = 0; i < opts.length; i++){
    new_pixels.push([0, 0, 0]);
  }

  var strip_info = {
    id: strip_number,
    length: opts.length,
    lo_byte: (opts.length * 3) % 256,
    hi_byte: parseInt((opts.length * 3) / 256, 10),
    pixels: new_pixels
  };

  this.strips.push(strip_info);

  //return the strip ID in case it's needed
  return strip_info;
};

//replaces one pixel in a strip
OPC.prototype.put_pixel = function(strip_id, pixel_index, colors){
  var self = this;

  self.strips[strip_id].pixels[pixel_index] = colors;

  var message = assemble_opc_message();

  self.opc_client.write(message, function(){
    self.emit('data_sent');
  });
};

//leave this- replaces all pixels in a strip
OPC.prototype.put_pixels = function(strip_id, pixels){
  var self = this;

  self.strips[strip_id].pixels = pixels;

  var message = assemble_opc_message();

  this.opc_client.write(message, function(){
    self.emit('data_sent');
  });
};

function assemble_opc_message(){
  //assemble our OPC message header
  for(var j = 0; j < this.strips.length, j++){
    var strip = this.strips[j];
    var header = String.fromCharCode(strip.id) + String.fromCharCode(0) + String.fromCharCode(strip.hi_byte) + String.fromCharCode(strip.lo_byte);
    var message_pixels = new Uint8ClampedArray(strip.length * 3);
    for(var i = 0; i < strip.length; i++){
      message_pixels[i*3] = strip.pixels[i][0];
      message_pixels[(i*3)+1] = strip.pixels[i][1];
      message_pixels[(i*3)+2] = strip.pixels[i][2];
    }
    var message = new Buffer(header);
    message = Buffer.concat([message, new Buffer(message_pixels)]);
  }
  return message;
}


module.exports = OPC;
