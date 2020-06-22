import StripeItemTemplate from './Templates/StripeItem.html';
import ThumbnailSizes from '../ThumbnailSizes/Images.js';

export default class StripeItem extends NBBMODULECLASS {
    constructor(parent, options, silent) {
        super(parent, options);
        this.options = options;

        this.imageDataUrl = `${this.parent.urlImageBase}/${this.options.pathExtracted}`;
        this.exposeThumbnails();
        this.target = this.toDOM(StripeItemTemplate({
            scope: {
                name: this.options.fileName,
                thumbnails: this.thumbnails
            }
        }));
        this.target.onclick = e => this.select(e);
        this.parent.target.append(this.target);
        this.image = this.target.querySelector('img');
        this.target.classList.add('loading');
        this.image.onload = e => {
            this.target.classList.remove('loading');
            this.target.classList.add('loaded');
        }
    }

    select(e) {
        this.parent.parent.parent.setLocationHash(this.options.pathExtracted);
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
