# Raspberry PI - Set Wifi

This is a free open-source React-native app that sets up your Raspberry Pi's wifi.
Setup any Raspberry Pi model using another mobile device.
No need to have a keyboard or mouse or anything!
iOS / Android app will configure your Raspberry Pi.

This project is split into two main modules.
React-native for mobile device.
NodeJS for Raspberry PI.

## NodeJS

The NodeJS part of this project is simply installed on your Raspberry Pi by running the installer.sh shell script in the raspberry folder.
It will start a access point, also serving as a web server, containing endpoints accessed by a mobile device to setup the wifi connection.

## React Native

The React Native part of thos project is a simpky all-in-on mobile app project that will run a client used tp setup your raspberry.

## Screeenshots


|Home|Location permission|Connect to device|Setup wifi|
| --- | --- | --- | --- |
|![home](/github-assets/screenshots/home.png)|![home](/github-assets/screenshots/askLocationPermission.png)|![home](/github-assets/screenshots/askConnectToDevice.png)|![home](/github-assets/screenshots/setupWifi.png)|