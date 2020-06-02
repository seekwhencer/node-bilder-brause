import ImageItemTemplate from './Templates/ImageItem.html';

export default class ImageItem extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.options = options;

            this.thumbnailSizeKey = 'a';
            this.imageDataUrl = `${this.parent.urlImageBase}/${this.options.pathExtracted}`;
            this.thumbnailUrl = `${this.parent.urlMediaBase}/${this.thumbnailSizeKey}/${this.options.hash}.jpg`;

            this.target = this.toDOM(ImageItemTemplate({
                scope: {
                    name : this.options.fileName,
                    thumbnailUrl: this.thumbnailUrl
                }
            }));

            this.target.onclick = e => this.select(e);

            this.parent.target.append(this.target);

            resolve();
        });
    }

    select(e) {
        this.parent.parent.setLocationHash(this.options.pathExtracted)
    }
}
