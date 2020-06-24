process.on('uncaughtException', error => {
    console.log('>>> GENERATOR WORKER ERROR:', error);
});

import './lib/Globals.js';
import GeneratorClient from './lib/GeneratorClient.js';

const generatorOptions = {
    protocol: 'ws',
    host: 'zentrale',
    port: 3055,
    reconnectIdle: 2000,

    imageSourceBaseURL: 'http://zentrale:3050/v1/media/original',
    uploadBaseUrl: 'http://zentrale:3050/v1/upload',

    pathSourceFrom: '/ext/wd4/storage/fotos',
    pathSourceTo: '/mnt/fotos',
    pathThumbnailFrom: '/ext/wd4/storage/gallery',
    pathThumbnailTo: '/mnt/gallery'
};

new GeneratorClient(generatorOptions).then(generator => {
    LOG('>>> GENERATOR IS UP AND WAITING...')
});
