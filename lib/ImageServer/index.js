import * as Routes from './Routes/index.js';

export default class ImageServer extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.options = this.app.config.server;
        this.engine = APP;

        this.on('listen', () => LOG('>>> SERVER LISTEN ON PORT:', this.options.port));

        this.registerFrontend();
        this.registerRoutes();

        return this.start();
    }

    start() {
        return new Promise((resolve, reject) => {
            this.engine.listen(this.options.port, () => {
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
        this.engine.use('/', EXPRESS.static(P('public')));
        ['css', 'js', 'images'].forEach(i => this.engine.use(`/${i}`, EXPRESS.static(P(`frontend/dist/${i}`))));
    }
}