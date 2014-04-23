
//lets just see if this works.

//String.fromCharCode(r);


var len_hi_byte = parseInt(((20 * 3)  / 256), 10);
var len_lo_byte = (20 * 3) % 256
var header = String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(len_hi_byte) + String.fromCharCode(len_lo_byte);
var colors = '';
var pixels = new Uint8ClampedArray(128);
for(var i = 0; i < 128; i+=3){
	pixels[i] = 0;
	pixels[i+1] = 258;
	pixels[i+2] = 0
}
console.log(pixels.buffer.toString())
var message = new Buffer(header);
message = Buffer.concat([message, new Buffer(pixels)])
// console.log(message);


var net = require('net');
var client = net.connect({port: 7890},
    function() { //'connect' listener
  console.log('client connected');
  client.write(message);
  console.log(message);
  client.end();
});
client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});