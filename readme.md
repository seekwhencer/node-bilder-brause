# node-bilder-brause

Image gallery for browsing image folder. Developed on a Raspberry Pi 4b

![alt text](../master/docs/storage-interior.jpg?raw=true "Storage Interior #1")

## Installation
> prerequisites
```bash
sudo apt-get update -y
sudo apt-get install imagemagick -y
```

> node.js
```bash
# installing n as package manager

curl -L https://git.io/n-install | bash

# after console restart (reboot or source your .bashrc)
# changing node version to 14

n 14
```

> the app
```bash
cd /somewhere/on/my/disk 
git clone https://github.com/seekwhencer/node-bilder-brause.git
cd node-bilder-brause
npm install
```

## Run
```bash
npm start
```
