var opc_client = require('../open-pixel-control');

var client = new opc_client({
  address: '192.168.1.74',
  port: 7890
});

client.on('connected', function(){
  var strip = client.add_strip({
    length: 25
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
      [0, 0, 255]
  ],
    new_pixel;

  setInterval(function(){
    client.put_pixels(strip.id, pixels);
    new_pixel = pixels[0];
    pixels = pixels.slice(1);
    pixels.push(new_pixel);
  }, 200);
});

client.connect();
