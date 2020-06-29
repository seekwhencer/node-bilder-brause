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
## Configure it at first!
- is located in `config/default.json`
- duplicate it to:`config/myconfig.json` or what you want
- change:
  - `store.rootPath`  
  - `store.thumbnailPath` 
  - and replace all hosts to your hostname: `localhost` (or what ever)

## Run (with default config, not recommended)
```bash
npm run server
```

## Run (with your config, uhh)
```bash
export NODE_ENV=myconfig && npm run server
```

> if `config.generator.server.network` is `true`, then start:
```bash
# wwith default config
npm run generator

# with your config
export NODE_ENV=myconfig && npm run generator
```
Open now url: http://localhost:3050

## Architecture
This is the cheese bell node project. there is something under the glass:  

- the server app in `server/`
- the frontend app in `frontend/`
- the thumbnail generator in `generator/`

## `npm run` commands:
... from the top folder

- **`npm start`**  
Show the run commands

- **`npm run server`**  
Start the server

- **`npm run generator`**  
Start the generator client

- **`npm run digger`**  
Start the digger, the trigger to generate over the whole store

- **`npm run dev`**  
Start the frontend dev pipeline

- **`npm run build`**  
Build the frontend

- **`npm run install:server`**  
Install the server

- **`npm run install:generator`**  
Install the generator

- **`npm run install:frontend`**  
Install the frontend

- **`npm run fix`**  
Fix versions

- **`npm run postinstall`**  
Runs after installation of the "cheese bell" and installs the server and the generator.

#### Your environment configuration
..is placed in `config/myconfig.json`? Then enter:

```bash
export NODE_ENV=myconfig && npm run server
export NODE_ENV=myconfig && npm run generator
export NODE_ENV=myconfig && npm run digger
```


## Configuration
- Is located in `config/default.json`  
- Change the `NODE_ENV` variable to use your customized configuration file.

## The configuration file

- **server.host**  
The hostname or ip address of the host. Unused.  
    
- **server.port**  
The port for the app

- **server.rootURLPath**  
The first url path element like `v1` or `api` - or `api/v1`

- **server.frontendPath**  
The absolute or relative path for the static frontend builds, served by the app.

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
All routes, but not the frontend stuff, are api endpoints. Any endpoint sends a `json` response.

- **the funnel endpoint**  
http://localhost:3050/v1/funnel/:foldername/:foldername  
or  
http://localhost:3050/v1/funnel/:foldername/:foldername/:imagename.jpg  
    > check if it is a folder or a file and redirect to the folder data or image data endpoint.

- **the main entry route**  
http://localhost:3050/v1/folder

- **folder data**  
http://localhost:3050/v1/folder/:foldername/:foldername

- **image data**  
http://localhost:3050/v1/image/:foldername/:foldername/:imagename.jpg

- **media** (the thumbnail image)  
http://localhost:3050/v1/media/:size/:foldername/:foldername/:imagename.jpg
    > **size** means a key, defined in `shared/MediaSizes.js`  
    this endpoint returns the image data - or simple: the thumbnail image. 

- **media** (the original image)  
http://localhost:3050/v1/media/original/:foldername/:foldername/:imagename.jpg

- **upload** (receive the generated thumbnail from the generator client)  
http://localhost:3050/v1/upload/:size/:foldername/:foldername/:imagename.jpg
    > **size** means a key, defined in `shared/MediaSizes.js`  

## Development

There are two, okay three apps to work on it. The Server, the Generator and the Frontend.

#### Frontend
- builds a distribution package, stored in: `frontend/dist/`
- a `index.html`, a `app.min.js` and a `app.min.css` will be generated
- the production bundle build will be served by the server app
- change in the frontend folder. a `npm run dev` starts the webpack dev server
- or leave in the main folder and enter also: `npm run dev`
- all webpack configs stored in `frontend/config/`
- `npm run build` creates the production bundle
- a `npm install` on the main cheese bell folder, installs the server and the generator: but not the frontend.
  change into the frontend folder and run `npm install`
- or on the cheese bell level: `npm run install:frontend`

#### Server
- runnable on a raspberry pi 4b
- 

## Specs

#### Server app

- located in the folder: `server/`
- written in ES6
- without database
- aggregate file system, nested
- api
- runs on a Raspberry Pi (4)
- read exif data from images

#### Frontend app

- located in the `frontend/` folder
- written in ES6, class pattern ;)
- using ES6 webpack configs (webpack & dev server as node app)
- sass
- js template literals (the purest way for templating)
- eslint & stylelint in the dev build pipeline
- no babel (the app needs the newest browser)

#### Generator

- located in `generator/`
- written in ES6
- is the worker (thread)
- manage a job queue
- generates thumbnails with imagemagick (snap at next)
- runs as worker, launched by the server app
- runs stand alone over the network ***(is in progress)***


## The Network Generator Client
Two ways exists to let the thumbnails generated. At first, per worker thread with the server app.
Okay. This is the basic way. This can take some time on a raspberry pi. To let your desktop machine do this job,
just download the repo on your empowered machine, configure and run it.
  
#### How it works?
The **server app** and the **generator client** are using the same worker thread and queue mechanic. or the same code.
The server app opens a websocket server, the client connect to it. Then happens:

- an image request for a not existing file, triggers a
- websocket message from the server to the client to start with a new image,
- by downloading the original from the api: `media/original` (client)
- store it locally (client)
- and add a new queue job with the downloaded original file (client)
- then the job will be processed and on complete (client)
- the client app uploads the generated thumbnail to the server app at: `upload/:size`
- the server app receive the image upload and
- after the upload was complete, the requested image (from the first step of this list) emits the event: `complete`
- because the requested image is stored in the `app.generator.queue` as object and can do this ... ;)
- the event, to finish the image request from the browser, was set in the route controller: `server/lib/ImageServer/Routes/Media.js`

#### Configure the generator server
Open the file: `config/default.json`:

```json
"generator": {
    "protocol": "ws",
    "host": "zentrale",
    "port": 3055,
    "reconnectIdle": 2000
},
```

#### Configure the generator client
Open the file, at the moment, `generator/standalone.js` and change it at your needs:

```javascript
const generatorOptions = {
    protocol: 'ws',
    host: 'zentrale',
    port: 3055,
    reconnectIdle: 2000,

    imageSourceBaseURL: 'http://zentrale:3050/v1/media/original',
    uploadBaseUrl: 'http://zentrale:3050/v1/upload',
};
```

- **imageSourceBaseURL**  
Is the URL base from where the original images will be downloaded.

- **uploadBaseUrl**  
Is the URL base to upload the generated thumbnail image

> will be refactored, it looks ugly

#### Run it
```bash
# from the top folder
npm run generator

#from the generator folder
npm start
```
## The Digger
This standalone app as part of the generator package:
- runs on the raspberry pi
- collects the whole folder tree
- request a thumbnail from the server
- the server will generate a thumbnail, if no exists


#### Run the digger
```bash
# From the top folder
npm run digger

# From the generator folder
npm run digger
```

#### Configure the digger
Open `generator/digger.js` and change:

```javascript
const diggerOptions = {
    thumbnailSizeKey: 'i'
};
```
To request another thumbnail type for all (very all) images, change the `thumbnailSizeKey`.

## Docker
Jo.

#### Configure
- open the `docker-compose.yml`
- change to your own paths:
  ```
  volumes:
      - .:/app
      - /mnt/c/Data/Fotos:/ext/wd4/storage/fotos
      - /mnt/c/Data/FotosThumbnails:/ext/wd4/storage/gallery
  ```

#### Run
- Both together: the server and the generator client (recommended at the moment)
```bash
docker-compose up -d bilderbrause_together
```

- The server
```bash
docker-compose up -d bilderbrause_server
```

- The generator client
```bash
docker-compose up -d bilderbrause_generator
```


#### Create your own config
- duplicate `config/docker.json` to `config/myconfig.json`
- make your changes
- open the `docker-compose.yml`
- change:
  ```
  environment:
      NODE_ENV: myconfig
  ```
