var opc_client = require('../open-pixel-control');

var client = new opc_client({
  address: '192.168.1.74',
  port: 7890
});

client.on('connected', function(){
  var strip = client.add_strip({
    length: 15 * 4
  });

  var i = 0, color = [255, 255, 255], color2 = [255, 0, 0],
    color3 = [0, 255, 0], color4 = [0, 0, 255], pixels = new Uint8Array(180);

  for(i = 0; i < 45; i+=3){
    pixels[i] = color[0];
    pixels[i + 1] = color[1];
    pixels[i + 2] = color[2];
  }

  for(i = 45; i < 90; i+=3){
    pixels[i] = color2[0];
    pixels[i + 1] = color2[1];
    pixels[i + 2] = color2[2];
  }

  for(i = 90; i < 135; i+=3){
    pixels[i] = color3[0];
    pixels[i + 1] = color3[1];
    pixels[i + 2] = color3[2];
}
/*
  for(i = 0; i < 15; i++){
    pixels.push(color4[0]);
    pixels.push(color4[1]);
    pixels.push(color4[2]);
  }
*/


  client.send_raw_data(strip.id, pixels);
});

client.connect();
