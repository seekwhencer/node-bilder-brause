/**
 * This is the stand alone worker websocket bridge
 * to speed up from a faster machine
 *
 */

import {Worker, isMainThread, workerData} from 'worker_threads';
import path from 'path';
import WebSocket from 'ws';

import ModuleClass from './ModuleClass.js';

export default class Generator extends ModuleClass {
    constructor(options) {
        super(options);

        return new Promise((resolve, reject) => {
            this.label = 'GENERATOR STAND ALONE MASTER';
            LOG(this.label, 'INIT');

            this.options = options;
            this.queue = [];

            this.thread = new Worker(path.resolve('./index.js'), {
                workerData: {
                    // some inital data
                }
            });

            // events

            this.websocketClient = new WebSocket('ws://zentrale:3055', {
                perMessageDeflate: false
            });

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
                if (code != 0)
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
            this.thread.postMessage({
                message: 'add-file',
                file: file.aggregate()
            });
            return file;
        }
    }

}


