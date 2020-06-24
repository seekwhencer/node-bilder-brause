import {Worker, isMainThread, workerData} from 'worker_threads';
import path from 'path';
import WebsocketServer from "./WebsocketServer.js";

export default class Generator extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'GENERATOR';
            LOG(this.label, 'INIT');

            this.queue = [];

            this.thread = new Worker(path.resolve('../generator/index.js'), {
                workerData: {
                    // some inital data
                }
            });

            this.websocketServer = new WebsocketServer(this);

            this.thread.on('message', data => {
                if (data.message === 'job-complete') {
                    const found = this.queue.filter(q => q.hash === data.job.hash)[0];
                    found.emit('complete', data.job);
                }
            });

            this.thread.on('error', err => {
                LOG(this.label, '>>> ERROR', err)
            })

            this.thread.on('exit', code => {
                if (code !== 0)
                    LOG(this.label, `Worker stopped with exit code ${code}`);
            })

            resolve(this);
        });
    }

    addJob(file) {
        const found = this.queue.filter(q => q.hash === file.hash)[0];
        if (found) {
            return found;
        } else {
            LOG(this.label, 'ADD JOB', file.filePath);
            this.queue.push(file);

            const postMessage = {
                message: 'add-file',
                file: file.aggregate()
            };

            // this on the same machine
            this.thread.postMessage(postMessage);

            // this on remote machines
            //this.websocketServer.sendAll(postMessage);

            return file;
        }
    }

}


