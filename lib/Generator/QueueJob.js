import ImageMagick from 'imagemagick-stream';
import fs from 'fs-extra';

export default class QueueJob extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.options = options;
        this.hash = this.options.hash;

        this.sizes = this.app.config.media.sizes;
        this.sizeData = this.sizes.filter(s => s.name === this.options.size)[0];
        this.imagemagickSizeString = `${this.sizeData.size}x${this.sizeData.size}`;

        this.quality = 90;

        this.on('complete', () => {
            LOG('>>> JOB COMPLETE', this.hash, this.options.size, this.imagemagickSizeString);
            this.parent.emit('job-complete', this);
        });
    }

    remove() {
        LOG('>>> JOB REMOVED', this.hash);
        this.parent.remove(this.hash); // removes this instance
    }

    run() {
        LOG('>>> JOB RUN', this.hash);
        const filePath = this.options.filePath;
        const thumbnailPath = this.options.thumbnailPath;
        fs.mkdirpSync(thumbnailPath);
        const thumbnail = `${thumbnailPath}/${this.options.hash}_${this.options.size}.jpg`;

        const read = fs.createReadStream(filePath);
        const write = fs.createWriteStream(thumbnail);

        write.on('finish', () => this.emit('complete', this));

        const resize = ImageMagick().resize(this.imagemagickSizeString).quality(this.quality);
        read.pipe(resize).pipe(write);
    }

}
