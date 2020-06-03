import ImageMagick from 'imagemagick-stream';
import fs from 'fs-extra';

export default class QueueJob extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.options = options;
        this.hash = this.options.hash;

        this.sizes = {
            a: '100x100',
            b: '200x200',
            c: '300x300',
            d: '400x400',
            e: '500x500',
            f: '600x600',
            g: '700x700',
            h: '800x800',
            i: '900x900',
            j: '1000x1000'
        }

        this.on('complete', () => {
            console.log('>>> JOB COMPLETE', this.hash);
            this.parent.emit('job-complete', this);
        });
    }

    remove() {
        console.log('>>> JOB REMOVED', this.hash);
        this.parent.remove(this.hash); // removes this instance
    }

    run() {
        console.log('>>> JOB RUN', this.hash);
        const filePath = this.options.filePath;
        const thumbnailPath = this.options.thumbnailPath;
        fs.mkdirpSync(thumbnailPath);
        const thumbnail = `${thumbnailPath}/${this.options.hash}_${this.options.size}.jpg`;

        const read = fs.createReadStream(filePath);
        const write = fs.createWriteStream(thumbnail);

        write.on('finish', () => this.emit('complete', this));

        const resize = ImageMagick().resize(this.sizes[this.options.size]).quality(90);
        read.pipe(resize).pipe(write);
    }

}
