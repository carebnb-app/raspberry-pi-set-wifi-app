#! /bin/bash

# Update apt get
sudo apt-get -y upgrade
sudo apt-get -y update

# Install NodeJS
#curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
wget https://nodejs.org/dist/v11.15.0/node-v11.15.0-linux-armv6l.tar.gz
tar -xzf node-v11.15.0-linux-armv6l.tar.gz
sudo cp -R node-v11.15.0-linux-armv6l/. /usr/local/

# Install dependencies
sudo apt-get install -y nodejs git
sudo apt-get install -y build-essential
sudo apt-get install -y libudev-dev
sudo apt-get install -y hostapd
sudo apt-get install -y dnsmasq
sudo apt-get install -y iw

# Update apt get (again)
# Raspberry will reload network card, might take a while or lose connection
sudo apt-get -y upgrade

# Install pm2
sudo npm install -g pm2
sudo npm install -g node-gyp

# Setup project
npm install

# Activate rf interfaces
sudo rfkill unblock wifi
sudo rfkill unblock all

# Start pm2
sudo pm2 start ./index.js --name=WIFI-SERVICE
sudo pm2 startup
sudo pm2 save
