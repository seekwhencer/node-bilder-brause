import Item from './Item.js';

export default class Image extends Item {
    constructor(parent, options) {
        super(parent, options);

        this.type = 'image';
        this.filePath = options.filePath;
        this.fileName = options.fileName;
        this.extension = options.extension;
        this.size = options.size;

        this.pathExtracted = this.filePath.replace(`${this.parent.rootPath}/`, '');
        this.thumbnailPathsCrumped = this.extractThumbnailPaths(3, 3);
        this.thumbnailPath = `${this.parent.thumbnailPath}/${this.thumbnailPathsCrumped.join('/')}/${this.hash}`;

    }

    extractThumbnailPaths(digits, count) {
        let chunks = [];
        for (let i = 0, e = digits; i < this.hash.length; i += digits, e += digits) {
            chunks.push(this.hash.substring(i, e));
        }
        chunks = chunks.filter((block, i) => i < count);
        return chunks;
    }
};