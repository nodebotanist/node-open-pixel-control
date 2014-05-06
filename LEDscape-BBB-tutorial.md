# LEDscape/BeagleBone Black tutorial

## What you need:

* BeagleBone Black
* WS2811 or NeoPixels LED system (I used [this strip](https://www.adafruit.com/products/1376) cut and re-soldered into a 5x5 grid)
* [LEDscape fork with OPC server](https://github.com/Yona-Appletree/LEDscape) installed and running as a service on BBB (See the README for installation/starting the service)

## Steps:

1. Wire up the strip

  You can run `node pinmap.js` from the root of the LEDscape folder, and it'll print out an ASCII pin map.

  With standard setup, hook up power to 3.3v (P9_3 or P9_4), GND to GND (P9_1 or P9_2), and data to P9_22.

  (COMING SOON: PHOTO)

2. ssh into your BeagleBone

3. Make sure the service is running on the BBB

  once ssh'ed in, `systemctl is-active ledscape`

4. Clone this project OR `npm install open-pixel-control` and write your own script

5. `node /path/to/project/examples/rgb-runner.js`
