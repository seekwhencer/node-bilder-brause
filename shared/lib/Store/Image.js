import Item from './Item.js';
import Exif from "./Exif.js";

export default class Image extends Item {
    constructor(parent, options) {
        super(parent, options);
        this.options = options;
        this.type = 'image';
        this.id = options.id;

        this.generateHash();

        this.filePath = options.filePath;
        this.fileName = options.fileName;
        this.extension = options.extension;
        this.size = options.size;

        this.pathExtracted = this.filePath.replace(`${this.parent.rootPath}/`, '');
        this.pathCrumped = this.pathExtracted.split('/');

        this.thumbnailPathsCrumped = this.extractThumbnailPaths(3, 3);
        this.thumbnailPath = `${this.parent.thumbnailPath}/${this.thumbnailPathsCrumped.join('/')}`;

        this.uri = encodeURI(this.pathCrumped.join('/')).replace(/^\//, '').replace(/\/$/, '');

        this.exifIO = new Exif(this);

    }

    extractThumbnailPaths(digits, count) {
        let chunks = [];
        for (let i = 0, e = digits; i < this.hash.length; i += digits, e += digits) {
            chunks.push(this.hash.substring(i, e));
        }
        chunks = chunks.filter((block, i) => i < count);
        return chunks;
    }

    aggregate() {
        return {
            type: this.type,
            id: this.id,
            hash: this.hash,
            filePath: this.filePath,
            fileName: this.fileName,
            extension: this.extension,
            size: this.size,

            pathExtracted: this.pathExtracted,
            pathCrumped: this.pathCrumped,

            thumbnailPathsCrumped: this.thumbnailPathsCrumped,
            thumbnailPath: this.thumbnailPath,

            uri: this.uri,

            atime: this.options.atime,
            btime: this.options.btime,
            ctime: this.options.ctime,
            mtime: this.options.mtime
        }
    }

    readExif() {
        return this.exifIO
            .read(this.filePath)
            .then(exif => {
                this.exif = exif;
                return Promise.resolve(this.exif);
            });
    }

    generateTumbnailPaths() {

    }

    get thumbnailPath() {
        return this._thumbnailPath;
    }

    set thumbnailPath(val) {
        this._thumbnailPath = val;

    }
};
