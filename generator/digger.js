process.on('uncaughtException', error => {
    console.log('>>> GENERATOR WORKER ERROR:', error);
});

import './lib/Globals.js';
import Digger from './lib/Digger.js';

const diggerOptions = {
    thumbnailBaseURL: 'http://zentrale:3050/v1/media',
    thumbnailSizeKey: 'i'
};

new Digger(diggerOptions).then(digger => {
    LOG('>>> DIGGER IS UP AND WAITING...')
});
