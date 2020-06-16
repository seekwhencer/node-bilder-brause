import dateFormat from 'dateformat';
import Module from './Module.js';

export default class Log extends Module {
    constructor(args) {
        super(args);
        this.label = 'LOGGER';

        global.LOG = this.log;
        global.ERROR = this.error;

    }

    log() {
        if (DEBUG === false) {
            return false;
        }
        let output = [
            '[',
            dateFormat(new Date(), "H:MM:ss - d.m.yyyy"),
            ']'
        ].concat(Array.from(arguments));
        console.log.apply(console, output);
    }

    error() {
        if (DEBUG === false) {
            return false;
        }
        let output = [
            '[',
            dateFormat(new Date(), "H:MM:ss - d.m.yyyy"),
            ']'
        ].concat(Array.from(arguments));
        console.error.apply(console, output);
    }
}
