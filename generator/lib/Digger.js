import Config from '../../shared/lib/Config.js';
import Store from '../../shared/lib/Store/index.js';
import fs from 'fs-extra';
import got from "got";

export default class Digger extends NBBMODULECLASS {
    constructor(options) {
        super(options);

        return new Promise((resolve, reject) => {
            this.label = 'DIGGER |';
            LOG(this.label, 'INIT');

            this.app = this;

            this.concurrentJobs = 0;
            this.index = 0;

            // this is the chain
            this.on('image-complete', index => {
                this.concurrentJobs--;
                this.index++;
                this.trigger();
            });

            // config
            new Config(this)
                .then(config => {
                    this.config = config;
                    this.options = {
                        ...this.app.config.digger,
                        ...options
                    };
                    this.includes = this.config.media.extensions.images;
                    // store
                    return new Store(this);
                })
                .then(store => {
                    this.store = store;
                    // collect all, really all, files
                    return this.collectAll();
                })
                .then(() => {
                    LOG('');
                    LOG(this.label, 'FLATTEN AND CHECK EXISTING THUMBNAILS');
                    LOG('');
                    return this.flattenFolder(this.data);
                })
                .then(() => {
                    LOG(this.label, 'IMAGES COLLECTED', this.flattenImageTree.length);
                    LOG('');
                    this.trigger(this.options.startIndex);
                    resolve(this);
                });
        });
    }

    collectAll() {
        LOG('');
        LOG(this.label, 'COLLECTING');
        LOG('');
        this.flattenImageTree = [];

        return this.store
            .collect(this.store.rootPath, true, this.includes, true)
            .then(data => {
                this.data = data;
                return Promise.resolve(data);
            });
    }

    flattenFolder(data) {
        return new Promise((resolve, reject) => {
            data.childs ? data.childs.forEach(child => {
                if (child.type === 'image') {
                    child.diggerMediaURL = `${this.options.thumbnailBaseURL}/${this.options.thumbnailSizeKey}/${child.pathExtracted}`;
                    child.thumbnail = `${child.thumbnailPath}/${child.hash}_${this.options.thumbnailSizeKey}.jpg`;

                    if (!fs.existsSync(child.thumbnail)) {
                        this.flattenImageTree.push(child);
                        LOG(this.label, 'IMAGE ADDED', child.thumbnail, child.diggerMediaURL);
                    } else {
                        //LOG(this.label, 'THUMBNAIL EXISTS:', child.thumbnail, child.diggerMediaURL);
                    }

                }
                if (child.type === 'folder') {
                    this.flattenFolder(child);
                }
            }) : null;
            resolve();
        });
        /*
          'event',                 'items',
          'parent',                'app',
          'id',                    'options',
          'atime',                 'btime',
          'mtime',                 'ctime',
          'type',                  '_hash',
          'filePath',              'fileName',
          'extension',             'size',
          'pathExtracted',         'pathCrumped',
          'thumbnailPathsCrumped', '_thumbnailPath',
          'uri',                   'exifIO'
         */
    }

    trigger(index) {
        index ? this.index = index : null;

        if (this.index >= this.flattenImageTree.length) {
            return;
        }

        if (this.concurrentJobs > this.options.maxConcurrentJobs) {
            return;
        }

        const image = this.flattenImageTree[this.index];
        if (!image) {
            this.emit('image-complete');
            return;
        }

        LOG(this.label, 'IMAGE URL', 'CONCURRENT JOBS:', this.concurrentJobs, 'IMAGE INDEX:', this.index, image.diggerMediaURL);
        this.concurrentJobs++;
        got(image.diggerMediaURL)
            .then(image => {
                this.emit('image-complete', this.index);
            })
            .catch(error => {
                LOG(this.label, '>>> UPLOAD ERROR. IMAGE INDEX:', this.index, image.diggerMediaURL);
                this.emit('image-complete', this.index);
            });

        if (this.concurrentJobs <= this.options.maxConcurrentJobs) {
            this.index++;
            this.trigger();
        }
    }
}
