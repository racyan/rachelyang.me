---
layout: default.html
title: Temperature Sensor
permalink: /projects/temp_sensor/
---

<h3> Relevant skills: LTSpice, Eagle (schematic capture and board layout), Arduino </h3>

<img src="/assets/images/projects/temp_sensor/temp-sensor_board.jpg" width="200" class="left" alt="alt text" thumbnail="width=200">

I designed and built a temperature sensor, with a range from 25 to 100 degrees Celsius, that used a proportional-to-absolute-temperature (PTAT) current source. To convert the analog current measurements into digital measurements, I also designed and built a dual-slope analog-to-digital converter (ADC). These digital measurements were then read by an Arduino nano, which then converted the data into temperature and displayed the measured temperature via  serial port on a PC. 

I simulated the system in LTSpice, and I designed a custom board for all the hardware components of the system in Eagle. The temperature sensor was verified to be fairly linear (see data below in thumbnails).

Eagle CAD and gerber files for the project can be found on [GitHub](https://github.com/racyan/6301-thermometer).

<div class="clear"></div>

<ul class="image-list">
    <li>
        <a href="/assets/images/projects/temp_sensor/temp-sensor_schematic.png">
        <img src="/assets/images/projects/temp_sensor/temp-sensor_schematic.png" height="100" alt="alt text" thumbnail="height=100"></a>
    </li>
    <li>
        <a href="/assets/images/projects/temp_sensor/temp-sensor_layout.png">
        <img src="/assets/images/projects/temp_sensor/temp-sensor_layout.png" height="100" alt="alt text" thumbnail="height=100"></a>
    </li>
	<li>
        <a href="/assets/images/projects/temp_sensor/temp-sensor_board.jpg">
        <img src="/assets/images/projects/temp_sensor/temp-sensor_board.jpg" height="100" alt="alt text" thumbnail="height=100"></a>
    </li>
    <li>
        <a href="/assets/images/projects/temp_sensor/temp-sensor_data.png">
        <img src="/assets/images/projects/temp_sensor/temp-sensor_data.png" height="100" alt="alt text" thumbnail="height=100"></a>
    </li>
</ul>
