import './lib/Global/Globals.js';
import App from './lib/App.js';

const namespace = 'GALLERY';

// create the app and run it
new App()
    .then(app => global[namespace] = app)
    .then(() => {
        LOG('');
        LOG('');
        LOG('/////////');
        LOG('/// >>> LÄUFT ...');
        LOG('');
    });

