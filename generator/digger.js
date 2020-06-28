import './lib/Globals.js';
import Digger from './lib/Digger.js';

const diggerOptions = {
    // override options from json file here
};

new Digger(diggerOptions).then(digger => {
    LOG('>>> DIGGER IS UP AND WAITING...')
});
