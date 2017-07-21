---
layout: default
title: Wireless Peripheral Data Protocol
permalink: /projects/wireless_peripherals/
---

<img src="/assets/images/projects/wireless_peripherals/wireless-peripherals_schematic.PNG" width="200" class="left" alt="alt text">

This project created a data communication protocol for sending inertial measurement unit (IMU) data, i.e. gyroscope and accelerometer data, and button input data over Bluetooth to an FPGA, where the data was processed for further use.

First, the data from the IMU was communicated over I2C to an Arduino nano, and the button input data was read by the Arduino as digital inputs. I then programmed the Arduino to process the incoming data to work with the serial data communication protocol that I designed. 

The protocol works as follows: A single data sequence contained eight 8-bit packets. Each 8-bit packet contained 7 bits of data, with the eighth bit serving as a flag to indicate the beginning of a data sequence. The data were serially pushed as data bits into each packet, starting from the gyroscope and accelerometer data (9 bits, signed for each axis) and ending with a data bit for each button input.

The Arduino then sent the data packets over Bluetooth to the FPGA, where the data was sampled into the clock domain on the FPGA. Once sampled, the data was then decoded from the data communication protocol. Next, the raw gyroscope and accelerometer data for all three axes (x, y, z) were smoothed using a moving average to reduce noise or spikes in the data. The button input data were also debounced.

Skills used: Arduino, FPGA, verilog, Bluetooth, I2C

<div class="clear"></div>

<ul class="image-list">
    <li>
        <a href="/assets/images/projects/wireless_peripherals/wireless-peripherals_block-diagram.PNG">
        <img src="/assets/images/projects/wireless_peripherals/wireless-peripherals_block-diagram.PNG" height="100" alt="alt text"></a>
    </li>
    <li>
        <a href="/assets/images/projects/wireless_peripherals/wireless-peripherals_schematic.PNG">
        <img src="/assets/images/projects/wireless_peripherals/wireless-peripherals_schematic.PNG" height="100" alt="alt text"></a>
    </li>
<!--    <li>
        <a href="/assets/images/projects/amplifier/amplifier_picture.JPG">
        <img src="/assets/images/projects/amplifier/amplifier_picture.JPG" height="100" alt="alt text"></a>
    </li>
    <li>
        <a href="/assets/images/projects/amplifier/amplifier_picture.JPG">
        <img src="/assets/images/projects/amplifier/amplifier_picture.JPG" height="100" alt="alt text"></a>
    </li>
    <li>
        <a href="/assets/images/projects/amplifier/amplifier_picture.JPG">
        <img src="/assets/images/projects/amplifier/amplifier_picture.JPG" height="100" alt="alt text"></a>
    </li> -->
</ul>
