process.on('uncaughtException', error => {
    console.log('>>> GENERATOR CLIENT ERROR:', error);
});

import './lib/Globals.js';
import GeneratorClient from './lib/GeneratorClient.js';

const generatorOptions = {
    // override here the config json
};

new GeneratorClient(generatorOptions).then(generator => {
    LOG('>>> GENERATOR IS UP AND WAITING...')
});
