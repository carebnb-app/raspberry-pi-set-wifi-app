# Raspberry PI - Set Wifi: Raspberry

This folder contains the Raspberry Pi's code.
It will start a wifi server on the Raspberry, accessible from the mobile app side (react folder).

## Installing

Just run the following script.

```bash
$ sudo bash ./installer.sh
```

## Running

After installing it should be running automaticaly.
A new network will be available to connect from the mobile app.

## Changing SSID

To change SSID create a file called `.env` and add the following line
```
SSID=New SSID Name
```