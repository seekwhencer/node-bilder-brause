import path from 'path';
import Ramda from 'ramda';
import Express from 'express';

import '../../../shared/lib/Utils.js';
import Module from '../../../shared/lib/Module.js';
import Log from '../../../shared/lib/Log.js';
import Package from '../../package.json';

global.DEBUG = process.env.NODE_DEBUG || true;
DEBUG === 'true' ? global.DEBUG = true : null;
DEBUG === 'false' ? global.DEBUG = false : null;

new Log();

// register some global events
process.on('uncaughtException', error => {
    LOG('ERROR:', error);
});

// on
process.on('SIGINT', () => {

    try {
        // to some global things here
    } catch (e) {
        // ...
    }

    // some graceful exit code
    setTimeout(() => {
        process.exit(0);
    }, 500); // wait 2 seconds
});

process.stdin.resume();

global.APP_DIR = path.resolve(process.env.PWD);
global.PACKAGE = Package;
global.ENV = process.env.NODE_ENV || 'default';

global.EXPRESS = Express;
global.APP = EXPRESS();
global.R = Ramda;
global.MODULECLASS = Module;

LOG('');
LOG('//////////////////');
LOG('RUNNING:', PACKAGE.name);
LOG('VERSION:', PACKAGE.version);
LOG('ENVIRONMENT:', ENV);
LOG('/////////');
LOG('');


