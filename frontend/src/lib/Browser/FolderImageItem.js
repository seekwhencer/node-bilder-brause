import FolderImageItemTemplate from './Templates/FolderImageItem.html';
import ThumbnailSizes from './ThumbnailSizes.js';

export default class FolderImageItem extends NBBMODULECLASS {
    constructor(parent, options, silent) {
        super(parent, options);
        this.options = options;

        this.imageDataUrl = `${this.parent.parent.urlImageBase}/${this.options.pathExtracted}`;
        this.exposeThumbnails();
        this.target = this.toDOM(FolderImageItemTemplate({
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
                url: encodeURI(`${this.parent.parent.urlMediaBase}/${s.name}/${this.options.pathExtracted}`),
                media: s.media
            });
        });
    }
}
