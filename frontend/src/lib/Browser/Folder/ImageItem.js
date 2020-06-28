import ImageItemTemplate from './Templates/ImageItem.html';
import ImageCountStatsTemplate from './Templates/ImageCountStats.html';
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

        this.imageElement.addEventListener('loadstart', e => {
            this.target.classList.add('loading');
            console.log('>>> CONCURRENT IMAGE REQUESTS', this.parent.concurrentImageRequests);
        }, {once: true});

        this.imageElement.addEventListener('load', () => {
            this.parent.concurrentImageRequests--;
            this.target.classList.remove('loading');
            this.target.classList.add('loaded');
            this.nextImage();
        }, {once: true});

        this.imageElement.onerror = e => {
            console.log('>>>>>>>>>>>>>> ERROR', e);
            this.nextImage();
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
        this.drawCountStats();
        this.thumbnailIndex = this.thumbnails.length - 1 || 0;
        this.imageElement.src = this.thumbnails[this.thumbnailIndex].url;
        this.parent.concurrentImageRequests++;

        if (this.parent.concurrentImageRequests < this.parent.maxConcurrentImageRequests - 1) {
            this.nextImage();
        }
    }

    nextImage() {
        console.log('>>> NEXT IMAGE >>>', this.parent.images.length, this.imageIndex);
        if (this.imageIndex >= this.parent.images.length) {
            return false;
        }
        const nextImage = this.findNextImage();
        nextImage ? nextImage.load() : null;
    }

    findIndex() {
        this.imageIndex = this.parent.images.findIndex(i => i.options.hash === this.options.hash);
    }

    findNextImage() {
        if (this.imageIndex + 1 >= this.parent.images.length)
            return false;

        const nextImage = this.parent.images[this.imageIndex + 1];
        if (nextImage) {
            return nextImage;
        } else {
            this.imageIndex++;
            return this.findNextImage();
        }
    }

    drawCountStats() {
        if (!this.coutStatsElement) {
            this.coutStatsElement = toDOM(ImageCountStatsTemplate({
                scope: {}
            }));
            this.target.prepend(this.coutStatsElement);
            this.numberElement = this.coutStatsElement.querySelector('[data-number]');
            this.leftElement = this.coutStatsElement.querySelector('[data-left]');
            this.numberElement.innerText = `${this.imageIndex + 1} / ${this.parent.images.length}`;
            this.leftElement.innerText = this.parent.images.length - this.imageIndex - 1;
        }
    }
}
