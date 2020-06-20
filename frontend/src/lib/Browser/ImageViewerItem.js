import ImageViewerItemTemplate from './Templates/ImageViewerItem.html';
import ThumbnailSizes from './ThumbnailSizes/Detail.js';

export default class ImageViewerItem extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.options = options;

        this.imageDataUrl = `${this.parent.urlImageBase}/${this.options.pathExtracted}`;
        this.exposeThumbnails();
        this.target = this.toDOM(ImageViewerItemTemplate({
            scope: {
                name: this.options.fileName,
                thumbnails: this.thumbnails
            }
        }));
        this.parent.target.append(this.target);
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

    remove() {
        this.target ? this.target.remove() : null;
    }
}
