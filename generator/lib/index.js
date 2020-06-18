import {workerData, parentPort} from 'worker_threads';
import Queue from "./Queue.js";

export default class Generator extends MODULECLASS {
    constructor() {
        super();

        this.app = this;
        this.workerData = workerData;
        this.parentPort = parentPort;

        this.label = 'GENERATOR';
        LOG(this.label, 'INIT');

        // elevating events
        this.on('job-complete', job => {
            //LOG('>>> JOB COMPLETE', job);

            this.parentPort.postMessage({
                message: 'job-complete',
                job: job.aggregate()
            });
        });

        // receive message from the main app
        this.parentPort.on('message', data => {
            LOG(this.label, 'MESSAGE:', data.message);

            if (data.message === 'add-file') {
                this.addJob(data.file);
            }
        });

        // the generator queue
        this.queue = new Queue(this);

        // elevate events
        this.queue.on('added', job => this.emit('add', job));

    }

    addJob(file) {
        if (file.type === 'image')
            return this.queue.add(file);
    }
}


