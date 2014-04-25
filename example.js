var opc_client = require('./open-pixel-control');

var client = new opc_client({
  address: '127.0.0.1',
  port: 7890
});

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

  setTimeout(function(){
    client.put_pixels(strip_id, pixels);
    new_pixel = pixels[0];
    pixels = pixels.slice(1);
    pixels.push(new_pixel);
  }, 200);
});

client.connect();
