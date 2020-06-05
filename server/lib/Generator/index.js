import Queue from "./Queue.js";

export default class Generator extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'GENERATOR';
            LOG(this.label, 'INIT');

            // the generator queue
            this.queue = new Queue(this);

            // elevate events
            this.queue.on('added', job => this.emit('add', job));

            resolve(this);
        });
    }

    addJob(file) {
        if (file.type === 'image')
            return this.queue.add(file);
    }
}


