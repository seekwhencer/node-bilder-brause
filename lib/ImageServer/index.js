export default class ImageServer extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.options = CONFIG.server;
        this.engine = APP;

        this.on('listen', () => LOG('>>> SERVER LISTEN ON PORT:', this.options.port));

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

    }
}