import Module from '../../shared/lib/Module.js';
global.MODULECLASS = Module;

import Log from '../../shared/lib/Log.js';
new Log();

import '../../shared/lib/Utils.js';

import path from 'path';
global.APP_DIR = path.resolve(process.env.PWD);
global.DEBUG = true;
