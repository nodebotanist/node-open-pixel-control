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
  this.send_raw_data = send_raw_data;
}

//LEAVE THIS HERE- if you put extensions after this they will vanish
//because of the way inheritance in node works.
util.inherits(OPC, EventEmitter);

OPC.prototype.connect = function(){
  var self = this;
  self.opc_client = new net.Socket().connect(self.port, self.address,
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

  var message = assemble_opc_message(this.strips[strip_id]);

  self.opc_client.write(message, function(){
    self.emit('data_sent');
  });
};

//leave this- replaces all pixels in a strip
OPC.prototype.put_pixels = function(strip_id, pixels){
  var self = this;

  self.strips[strip_id].pixels = pixels;

  var message = assemble_opc_message(this.strips[strip_id]);

  this.opc_client.write(message, function(){
    self.emit('data_sent');
  });
};

var header, message_pixels, message;
function assemble_opc_message(strip){
  //assemble our OPC message header

  lengthBuffer = new Buffer(2);

  lengthBuffer[0] = strip.hi_byte;
  lengthBuffer[1] = strip.lo_byte;

  header = new Buffer(4);

  header[0] = 0;
  header[1] = 0;
  header[2] = lengthBuffer.readUInt8(0);
  header[3] = lengthBuffer.readUInt8(1);

  message_pixels = new Uint8Array(strip.length * 3);
  for(var i = 0; i < strip.length; i++){
    if(strip.pixels[i]){
      message_pixels[i*3] = strip.pixels[i][0];
      message_pixels[(i*3)+1] = strip.pixels[i][1];
      message_pixels[(i*3)+2] = strip.pixels[i][2];
    }
  }
  message = header;
  console.log(message);
  message = Buffer.concat([message, new Buffer(message_pixels)]);
  return message;
}

function send_raw_data(strip_id, pixels_as_int_array){
  var strip = this.strips[strip_id];
  header = String.fromCharCode(strip.id) + String.fromCharCode(0) + String.fromCharCode(strip.hi_byte) + String.fromCharCode(strip.lo_byte);
  console.log(header);
  message = new Buffer(header);
  message = Buffer.concat([message, new Buffer(pixels_as_int_array)]);
  this.opc_client.write(message, function(){
    // self.emit('data_sent');
  });
}


module.exports = OPC;
