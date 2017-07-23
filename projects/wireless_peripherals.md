---
layout: default
title: Wireless Peripheral Data Protocol
permalink: /projects/wireless_peripherals/
---

<h3> Relevant skills: Arduino, FPGA, Verilog, Bluetooth, I2C </h3>

<img src="/assets/images/projects/wireless_peripherals/wireless-peripherals_schematic_height200px.png" width="200" class="left" alt="alt text">

This project created a data communication protocol for sending inertial measurement unit (IMU) data, i.e. gyroscope and accelerometer data, and button input data over Bluetooth to an FPGA, where the data could then be used in other digital applications.

First, the data from the IMU is communicated over I2C to an Arduino nano, and the button input data is read by the Arduino as digital inputs. I then programmed the Arduino to process the incoming data to work with the serial data communication protocol that I designed. 

The protocol works as follows: A single data sequence contains eight 8-bit packets. Each 8-bit packet contains 7 bits of data, with the eighth bit serving as a flag to indicate the beginning of a data sequence. The data are serially pushed as data bits into each packet, starting from the gyroscope and accelerometer data (9 bits, signed for each axis) and ending with a data bit for each button input.

The Arduino then sends the data packets over Bluetooth to the FPGA, where the data is sampled into the clock domain on the FPGA. Once sampled, the data is then decoded from the data communication protocol. Next, the raw gyroscope and accelerometer data for all three axes (x, y, z) are smoothed using a moving average to reduce noise or spikes in the data. The button input data are also debounced.

A block diagram of this system is included in the thumbnails below.

<div class="clear"></div>

<ul class="image-list">
    <li>
        <a href="/assets/images/projects/wireless_peripherals/wireless-peripherals_block-diagram.PNG">
        <img src="/assets/images/projects/wireless_peripherals/wireless-peripherals_block-diagram_height200px.png" height="100" alt="alt text"></a>
    </li>
    <li>
        <a href="/assets/images/projects/wireless_peripherals/wireless-peripherals_schematic.PNG">
        <img src="/assets/images/projects/wireless_peripherals/wireless-peripherals_schematic_height200px.png" height="100" alt="alt text"></a>
    </li>
    <li>
        <a href="/assets/images/projects/wireless_peripherals/wireless-peripherals_picture.jpg">
        <img src="/assets/images/projects/wireless_peripherals/wireless-peripherals_picture_height200px.jpg" height="100" alt="alt text"></a>
    </li>
</ul>
