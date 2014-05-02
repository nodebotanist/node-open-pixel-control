# open-pixel-control

This library allows you to interface with an open pixel control (OPC) service

It's pretty unstable, and the API is NOT final.


The module returns a constructor for a client:

```
var opc_client = require('../open-pixel-control');

var client = new opc_client({
  address: '127.0.0.1',
  port: 7890
});
```
Which fires a 'connected' event when, well, it's connected!

You can then add strips. The client (will soon) handle appending strips for you.

Adding a strip returns its id - you'll need this to identify what strip you want to pass pixels to.

Pixels are represented as an array of array with 3 int values between 0 and 255 (RGB).

```
client.on('connected', function(){
  var strip_id = client.add_strip({
    length: 26
  });

  var pixels = [
      [255, 255, 255],
      [0, 0, 0],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 255],
      [0, 0, 0],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 255],
      [0, 0, 0],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 255],
      [0, 0, 0],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 255],
      [0, 0, 0],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 255]
  ],
    new_pixel;
```

client.put_pixels(strip_id, pixels); sends the data to the OPC server.

```
  setTimeout(function(){
    client.put_pixels(strip_id, pixels);
    new_pixel = pixels[0];
    pixels = pixels.slice(1);
    pixels.push(new_pixel);
  }, 200);
});
```

TODO:

* Add tutorial for LEDscape on BeagleBone Black
* Add tests
* Add strip caching for put_pixel ~~
* These docs need some serious <3!
