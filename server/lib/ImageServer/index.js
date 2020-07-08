import * as Routes from './Routes/index.js';
import path from 'path';
import http from 'http';

export default class ImageServer extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.options = this.app.config.server;
        this.label = 'IMAGE SERVER';
        LOG(this.label, 'INIT');

        this.on('listen', () => LOG(this.label, 'LISTEN ON PORT:', this.options.port));

        this.engine = APP;
        this.server = false;

        // CORS
        this.engine.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });

        this.registerRoutes();
        this.registerFrontend();

        // listen on the given port
        return this.start();
    }

    start() {
        return new Promise((resolve, reject) => {
            this.server = http.Server(this.engine);
            this.server.listen(this.options.port, () => {
                resolve(this);
                this.emit('listen');
            });
        });
    }

    stop() {
        //..
    }

    registerRoutes() {
        Object.keys(Routes).forEach(route => this.engine.use(`/${this.options.rootURLPath}`, new Routes[route](this)));
    }

    registerFrontend() {
        this.frontendPath = path.resolve('../frontend/dist');
        this.engine.use(EXPRESS.static(this.frontendPath));
    }
}
