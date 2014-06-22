var opc_client = require('../open-pixel-control');

var client = new opc_client({
  address: '127.0.0.1',
  port: 7890
});

client.on('connected', function(){
  var rings = client.add_strip({
    length: 25
  });
  var strip = client.add_strip({
    length: 25
  })

  var i = 0, color = [255, 255, 255];
  setInterval(function(){

    client.put_pixel(strip.id, i, color);
    client.put_pixel(rings.id, i, color);

    if(i == strip.length){
      i = 0;
      color = color[0] == 0 ? [255, 255, 255] : [0, 0, 0];
    } else {
      i++;
    }
  }, 200);
});

client.connect();
