#! /bin/bash

# Update apt get
sudo apt-get -y update
sudo apt --fix-broken -y install
sudo apt-get -y upgrade

# Install NodeJS
## This won't work on raspberries (arm-v6)
#curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
## This manually installs version 11 if needed
# wget https://nodejs.org/dist/v11.15.0/node-v11.15.0-linux-armv6l.tar.gz
# tar -xzf node-v11.15.0-linux-armv6l.tar.gz
# sudo cp -R node-v11.15.0-linux-armv6l/. /usr/local/

# Remove preexistent dependencies
# Necessary on raspberry PI 3A
sudo apt-get --purge remove -y node
sudo apt-get --purge remove -y nodejs

# Install dependencies
sudo apt-get install -y nodejs
sudo apt-get install -y git
sudo apt-get install -y build-essential
sudo apt-get install -y libudev-dev
sudo apt-get install -y hostapd
sudo apt-get install -y dnsmasq
sudo apt-get install -y iw
sudo apt-get install -y npm

# Install pm2
sudo npm install -g pm2
sudo npm install -g node-gyp

# Activate rf interfaces
sudo rfkill unblock wifi
sudo rfkill unblock all

# Setup project
npm install

# Start pm2
sudo pm2 start ./index.js --name=CAREBNB-WIFI
sudo pm2 startup
sudo pm2 save
