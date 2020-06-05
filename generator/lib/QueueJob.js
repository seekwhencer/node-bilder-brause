import ModuleClass from './ModuleClass.js';
import ImageMagick from 'imagemagick-stream';
import fs from 'fs-extra';
import MediaSizes from './MediaSizes.js';


export default class QueueJob extends ModuleClass {
    constructor(parent, options) {
        super(parent, options);

        this.options = options;
        this.hash = this.options.hash;

        this.sizes = MediaSizes;
        this.sizeData = this.sizes.filter(s => s.name === this.options.size)[0];
        this.imagemagickSizeString = `${this.sizeData.size}x${this.sizeData.size}`;

        this.quality = 90;

        this.on('complete', () => {
            console.log('>>> JOB COMPLETE', this.hash, this.options.size, this.imagemagickSizeString);
            this.parent.emit('job-complete', this);
        });
    }

    remove() {
        console.log('>>> JOB REMOVED', this.hash);
        this.parent.remove(this.hash); // removes this instance
    }

    run() {
        console.log('>>> JOB RUN', this.hash);
        //this.runThread();
        const filePath = this.options.filePath;
        const thumbnailPath = this.options.thumbnailPath;
        fs.mkdirpSync(thumbnailPath);
        this.thumbnail = `${thumbnailPath}/${this.options.hash}_${this.options.size}.jpg`;

        const read = fs.createReadStream(filePath);
        const write = fs.createWriteStream(this.thumbnail);

        write.on('finish', () => this.emit('complete', this));

        const resize = ImageMagick().resize(this.imagemagickSizeString).quality(this.quality);
        read.pipe(resize).pipe(write);
    }

    aggregate() {
        return {
            options: this.options,
            hash: this.hash,
            sizes: this.sizes,
            sizeData: this.sizeData,
            imagemagickSizeString: this.imagemagickSizeString,
            quality: this.quality,
            thumbnail: this.thumbnail
        };
    }
}
