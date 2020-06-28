/**
 * This is the stand alone worker websocket bridge
 * to speed up from a faster machine
 *
 */
import Config from '../../shared/lib/Config.js';
import {Worker, isMainThread, workerData} from 'worker_threads';
import path from 'path';
import WebSocket from 'ws';
import got from 'got';
import fs from 'fs-extra';
import FormData from 'form-data';
import os from 'os';

export default class GeneratorClient extends NBBMODULECLASS {
    constructor(options) {
        super(options);

        return new Config(this)
            .then(config => {
                this.config = config;
                return this.init(options);
            });
    }

    init(options){
        return new Promise((resolve, reject) => {
            this.label = 'CLIENT';
            LOG(this.label, 'INIT');

            this.app = this;
            this.options = {
                ...this.app.config.generator.client,
                ...options
            };

            this.cpuCount = os.cpus().length;
            this.threadIndex = 0;
            this.threads = [];
            this.queue = [];
            this.serverSocketUrl = `${this.options.protocol}://${this.options.host}:${this.options.port}`;

            this.uploadUrl = `${this.options.uploadBaseUrl}`;

            this.tempPath = `${APP_DIR}/temp`;
            fs.mkdirpSync(this.tempPath);

            this.on('job-complete', job => {
                this.uploadThumbnail(job);
            });

            this.on('upload-complete', job => {
                LOG(this.label, 'UPLOAD COMPLETE', job.hash, job.options.pathExtracted);
                this.send({
                    message: 'job-complete',
                    data: job
                });
                this.clear(job);
            });

            // create the threads by number of cpus
            this.createThreads();
            this.connect();

            resolve(this);
        });
    }

    createThreads() {
        for (let i = 0; i < this.options.maxThreads; i++) {
            const thread = new Worker(path.resolve('./index.js'), {
                workerData: {
                    // some inital data
                }
            });

            thread.on('message', data => {
                if (data.message === 'job-complete') {
                    const job = this.queue.filter(q => q.hash === data.job.hash)[0];
                    this.emit('job-complete', data, job);
                }
            });

            thread.on('error', err => {
                LOG(this.label, '>>> ERROR', err)
            });

            thread.on('exit', code => {
                if (code != 0)
                    LOG(this.label, `Worker stopped with exit code ${code}`);
            });

            this.threads.push(thread);
        }
    }

    addJob(file) {
        const found = this.queue.filter(q => q.hash === file.hash)[0];
        if (found) {
            return found;
        } else {
            LOG(this.label, 'ADD JOB', 'THREAD INDEX:', this.threadIndex, file.filePath);
            this.queue.push(file);
            this.postMessage({
                message: 'add-file',
                file: file
            });
            return file;
        }
    }

    postMessage(data) {
        // @TODO round robin durch alle threads
        this.threads[this.threadIndex].postMessage(data);
        this.threadIndex === this.options.maxThreads - 1 ? this.threadIndex = 0 : this.threadIndex = this.threadIndex + 1;
    }

    connect() {
        LOG(this.label, 'CONNECTING TO', this.serverSocketUrl);

        // the websocket client
        this.websocketClient ? delete this.websocketClient : null;
        this.websocketClient = new WebSocket(this.serverSocketUrl, {
            perMessageDeflate: false
        });

        this.websocketClient.on('open', data => {
            LOG(this.label, 'CONNECTED TO', this.serverSocketUrl);

            // send hi the first time
            this.send({
                message: 'hi',
                data: {
                    cow: 'bell'
                }
            });
        });

        this.websocketClient.on('close', data => {
            LOG(this.label, 'DISCONNECTED');
            this.reconnect();
        });

        this.websocketClient.on('error', data => {
            LOG(this.label, 'ERROR');
            this.reconnect();
        });

        this.websocketClient.on('message', data => this.onMessage(data));
    }

    disconnect() {
        delete this.websocketClient;
    }

    reconnect() {
        LOG(this.label, 'TRYING TO RECONNECT IN', this.options.reconnectIdle, 'MS');
        this.timer ? clearTimeout(this.timer) : null;
        this.timer = setTimeout(() => this.connect(), this.options.reconnectIdle);
    }

    send(data) {
        const message = JSON.stringify(data);
        this.websocketClient.send(message);
    }

    onMessage(data) {
        data = JSON.parse(data);
        if (data.message === 'add-file') {
            this.downloadImageSource(data.file);
        }
    }

    downloadImageSource(file) {
        // rewrite path for the local environment
        if (file) {
            file.id = file.hash;
            file.fileName = `${file.hash}`;
            file.filePath = `${this.tempPath}/${file.fileName}.${file.extension}`;
            file.thumbnailPath = this.tempPath;
        }

        const url = `${this.options.imageSourceBaseURL}/${file.pathExtracted}`;
        LOG(this.label, 'IMAGE URL', url, file.pathExtracted);

        got(url)
            .then(image => {
                LOG(this.label, 'IMAGE REQUESTED');
                return fs.writeFile(file.filePath, image.rawBody);
            })
            .then(() => {
                this.addJob(file)
            });
    }

    uploadThumbnail(job) {
        return new Promise((resolve, reject) => {
            const url = `${this.uploadUrl}/${job.job.options.size}`;
            LOG(this.label, 'UPLOAD', url, job.job.thumbnail);

            const form = new FormData();
            form.append('hash', job.job.options.hash);
            form.append('size', job.job.options.size);
            form.append('thumbnail', fs.createReadStream(job.job.thumbnail));
            form.submit(url, (err, res) => {
                if (err) {
                    LOG(this.label, 'UPLOAD ERROR', err);
                    resolve(job);
                } else {
                    res.resume();
                    this.emit('upload-complete', job.job);
                    resolve(job);
                }
            });
        });
    }

    clear(job) {
        LOG(this.label, 'CLEAR JOB', 'REMOVING:', job.options.filePath, job.thumbnail);
        fs.remove(job.options.filePath);
        fs.remove(job.thumbnail);
    }
}


