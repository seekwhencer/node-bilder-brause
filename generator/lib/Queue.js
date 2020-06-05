import ModuleClass from './ModuleClass.js';
import Job from './QueueJob.js';

export default class Queue extends ModuleClass {
    constructor(parent, options) {
        super(parent, options);

        this.jobs = [];

        this.on('job-added', job => {
            console.log('>>> JOB ADDED', job.hash, this.jobs.length);
            if (this.jobs.length === 1) // only on the first call
                this.run();

        });

        this.on('job-complete', job => {
            this.parent.emit('job-complete', job);
            job.remove();
            this.run();
        });

    }

    // called from the route controller
    add(image) {
        const exists = this.jobs.filter(j => j.hash === image.hash);
        if (exists.length > 0)
            return exists;

        const job = new Job(this, image);
        this.jobs.push(job);

        this.emit('job-added', job);

        return job;
    }

    remove(hash) {
        this.jobs = this.jobs.filter(j => j.hash !== hash);
    }

    run() {
        if (this.jobs.length > 0)
            this.jobs[0].run();
    }
}
