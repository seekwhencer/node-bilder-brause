import {Worker, isMainThread, workerData} from 'worker_threads';
import path from 'path';
import WebsocketServer from "./WebsocketServer.js";

export default class Generator extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'GENERATOR';
            LOG(this.label, 'INIT');

            this.options = {
                ...this.app.config.generator.server,
                ...options
            };
            this.queue = [];

            if (this.options.network) {
                // create the websocket server
                this.websocketServer = new WebsocketServer(this);
            } else {

                // create the local worker thread
                this.thread = new Worker(path.resolve('../generator/index.js'), {
                    workerData: {
                        // some inital data
                    }
                });

                // on any message from the local worker thread
                this.thread.on('message', data => {
                    if (data.message === 'job-complete') {
                        const found = this.queue.filter(q => q.hash === data.job.hash)[0];
                        found.emit('complete', data.job);
                    }
                });

                // error
                this.thread.on('error', err => {
                    LOG(this.label, '>>> ERROR', err)
                });

                // exit
                this.thread.on('exit', code => {
                    if (code !== 0)
                        LOG(this.label, `Worker stopped with exit code ${code}`);
                });
            }

            resolve(this);
        });
    }

    // called from the media route controller
    // returns the object
    // the the route controller, the logic awaits an event: 'complete'
    addJob(image) {
        const exists = this.queue.filter(q => q.hash === image.hash)[0];
        if (exists) {
            LOG(this.label, 'JOB EXISTS');
            return exists;
        } else {
            LOG(this.label, 'ADD JOB', image.filePath);
            this.queue.push(image); // @TODO the element wieder raushauen, wenns fertig ist

            const postMessage = {
                message: 'add-file',
                file: image.aggregate()
            };

            if (this.options.network === true) {
                this.websocketServer.sendAll(postMessage);
            } else {
                this.thread.postMessage(postMessage);
            }

            return image;
        }
    }

}


