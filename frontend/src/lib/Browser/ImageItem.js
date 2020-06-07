import ImageItemTemplate from './Templates/ImageItem.html';
import ThumbnailSizes from './ThumbnailSizes.js';

export default class ImageItem extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.options = options;

            this.thumbnailSizeKey = 'd';
            this.imageDataUrl = `${this.parent.urlImageBase}/${this.options.pathExtracted}`;
            //this.thumbnailUrl = `${this.parent.urlMediaBase}/${this.thumbnailSizeKey}/${this.options.hash}.jpg`;
            this.thumbnailUrl = `${this.parent.urlMediaBase}/${this.thumbnailSizeKey}/${this.options.pathExtracted}`;
            this.exposeThumbnails();

            this.target = this.toDOM(ImageItemTemplate({
                scope: {
                    name: this.options.fileName,
                    thumbnailUrl: this.thumbnailUrl,
                    thumbnails: this.thumbnails
                }
            }));

            this.target.onclick = e => this.select(e);

            this.parent.filesElement.append(this.target);

            resolve();
        });
    }

    select(e) {
        this.parent.parent.setLocationHash(this.options.pathExtracted)
    }


    exposeThumbnails() {
        this.thumbnails = [];
        ThumbnailSizes.forEach(s => {
            this.thumbnails.push({
                url: encodeURI(`${this.parent.urlMediaBase}/${s.name}/${this.options.pathExtracted}`),
                media: s.media
            });
        });
    }
}
