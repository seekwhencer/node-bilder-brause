process.on('uncaughtException', error => {
    console.log('>>> GENERATOR WORKER ERROR:', error);
});

import './lib/Globals.js';
import Generator from './lib/index.js';
const generator = new Generator();
