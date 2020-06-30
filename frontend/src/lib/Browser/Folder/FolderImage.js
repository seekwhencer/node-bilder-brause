import FolderImageItemTemplate from './Templates/FolderImageItem.html';
import ThumbnailSizes from '../ThumbnailSizes/Images.js';

export default class FolderImageItem extends NBBMODULECLASS {
    constructor(parent, options, silent) {
        super(parent, options);
        this.options = options;

        this.imageDataUrl = `${this.app.urlImageBase}/${this.options.pathExtracted}`;
        this.exposeThumbnails();
        this.target = this.toDOM(FolderImageItemTemplate({
            scope: {
                name: this.options.fileName,
                thumbnails: this.thumbnails
            }
        }));
        this.parent.target.append(this.target);
        this.imageElement = this.target.querySelector('img');

        this.imageElement.addEventListener('loadstart', e => {
            this.target.classList.add('loading');
        }, {once: true});

        this.imageElement.addEventListener('load', () => {
            console.log('>>>>>>>>>>>>>> FOLDER IMAGE LOADED');
            this.target.classList.remove('loading');
            this.target.classList.add('loaded');
            this.nextImage();
        }, {once: true});

        this.imageElement.onerror = e => {
            console.log('>>>>>>>>>>>>>> ERROR', e);
            this.target.classList.remove('loading');
            this.target.classList.add('failed');
            this.nextImage();
        }

    }

    exposeThumbnails() {
        this.thumbnails = [];
        ThumbnailSizes.forEach(s => {
            this.thumbnails.push({
                url: encodeURI(`${this.app.urlMediaBase}/${s.name}/${this.options.pathExtracted}`),
                media: s.media
            });
        });
    }

    load() {
        this.findIndex();
        this.thumbnailIndex = this.thumbnails.length - 1 || 0;
        this.imageElement.src = this.thumbnails[this.thumbnailIndex].url;
    }

    nextImage() {
        if(!this.parent.parent.folders)
            return false;

        if (this.imageIndex >= this.parent.parent.folders.length)
            return false;

        const nextImage = this.findNextImage();
        nextImage ? nextImage.load() : null;
    }

    findIndex() {
        this.imageIndex = this.parent.parent.folders.findIndex(i => i.image ? i.image.options.hash === this.options.hash : null);
    }

    findNextImage() {
        if (this.imageIndex + 1 >= this.parent.parent.folders.length)
            return false;

        const nextImage = this.parent.parent.folders[this.imageIndex + 1].image;
        if (nextImage) {
            return nextImage;
        } else {
            this.imageIndex++;
            return this.findNextImage();
        }
    }


}
