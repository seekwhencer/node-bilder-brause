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


## Configuration
The file is located in `config/default.json` and wired in the `package.json`

```json
"start": "export NODE_DEBUG=true && export NODE_ENV=default && node --experimental-modules --experimental-json-modules index.js"
```

Change the `NODE_ENV` variable to use your customized configuration file.


## The configuration file

- **server.host**  
The hostname or ip address of the host. Unused.  
    
- **server.port**  
The port for the app

- **server.rootURLPath**  
The first url path element like `v1` or `api` - or `api/v1`

- **server.frontendPath**  
The absolute or relative path for the static frontend builds, served by the app.

- **server.frontendDistPaths**  
Some static folder for the frontend on the top level like `/css`, `/js` and `/images`.

- **store.rootPath**  
This is the holy and absolute foto root path on your disk.

- **store.thumbnailPath** 
This is the the target folder to save the generated thumbnails.
 
- **store.thumbnailPathSplitDigits**  
How much digits (used from the file or folder hash) are used for one folder.

- **store.thumbnailPathSplitCount**  
How much subfolder should be created.  
    > for example: the hash like `a5fb152dd38c95fd2a155830d5f2705a` generates the subfolder:  
    `{store.thumbnailPath}/a5f/b15/2dd` and place the files in it:  
    `{store.thumbnailPath}/a5f/b15/2dd/a5fb152dd38c95fd2a155830d5f2705a.jpg`  
    here three subfolder with three digits - thats all !

- **frontend.staticsPath**  
This folder contains all the frontend stuff who comes via webpack.

- **frontend.viewsPath**  
Obsolete

- **frontend.urlRoot**  
Obsolete

- **frontend.title**  
The over all page title

- **media.extensions**  
Groups like `images` and `videos` with arrays of file extensions like:

- **media.extensions.images**   
Array with file extensions

- **media.extensions.videos**   
Array with file extensions

- **media.sizes**  
Array with thumbnail definitions


## Routes
All routes, but not the frontend stuff, are api endpoints. Any endpoint sends `json` responses.

- **the main entry route**  
http://localhost:3050/v1/folder

- **a folder**  
http://localhost:3050/v1/folder/:foldername/:foldername

- **an image**  
http://localhost:3050/v1/image/:foldername/:foldername/:imagename.jpg

- **an image with different resolution**  
http://localhost:3050/v1/image/:foldername/:foldername/:imagename_sizename.jpg
    > `sizename` is the `media.sizes[i].name`  


...
