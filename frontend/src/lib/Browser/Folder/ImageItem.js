import ImageItemTemplate from './Templates/ImageItem.html';
import ThumbnailSizes from '../ThumbnailSizes/Images.js';

export default class ImageItem extends NBBMODULECLASS {
    constructor(parent, options, silent) {
        super(parent, options);
        this.options = options;

        this.imageDataUrl = `${this.parent.urlImageBase}/${this.options.pathExtracted}`;
        this.exposeThumbnails();
        this.target = this.toDOM(ImageItemTemplate({
            scope: {
                name: this.options.fileName,
                thumbnails: this.thumbnails
            }
        }));
        this.target.onclick = e => this.select(e);
        this.parent.filesElement.append(this.target);
        this.imageElement = this.target.querySelector('img');

        this.imageElement.onloadstart = e => {
            this.target.classList.add('loading');
        };

        this.imageElement.onload = e => {
            this.next();
            this.target.classList.remove('loading');
            this.target.classList.add('loaded');
        }

        this.imageElement.onerror = e => {
            this.next();
            this.target.classList.remove('loading');
            this.target.classList.add('failed');
        }

    }

    select(e) {
        this.parent.parent.setLocationHash(this.options.pathExtracted);
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

    load() {
        this.findIndex();
        this.imageElement.src = this.thumbnails[0].url;
    }

    next() {
        const nextImage = this.parent.images[this.imageIndex + 1];
        nextImage ? nextImage.load() : null;
    }

    findIndex() {
        this.imageIndex = this.parent.images.findIndex(i => i.options.id === this.options.id);
    }
}
