import ImageViewerTemplate from './Templates/ImageViewer.html';
import ImageViewerItem from './ImageViewerItem.js';


export default class ImageViewer extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.options = options;

        this.urlBase = this.app.urlBase;
        this.urlFolderBase = this.app.urlFolderBase;
        this.urlImageBase = this.app.urlImageBase;
        this.urlMediaBase = this.app.urlMediaBase;
    }

    set(data) {
        this.data = data;
        this.draw();
    }

    draw() {
        // if it's not a file
        if (!this.data.file) {
            this.remove();
            return;
        }

        // if file type is not image
        if (this.data.file.type !== 'image')
            return;

        this.open();

    }

    open() {
        // create the dom
        if (!this.target) {
            this.target = this.toDOM(ImageViewerTemplate({
                scope: {
                    data: this.data
                }
            }));
            this.parent.target.prepend(this.target);
        }
        document.querySelector('body').style.overflow = 'hidden';
        this.show();
    }

    close() {
        this.remove();
    }

    remove() {
        this.target ? this.target.remove() : null;
        document.querySelector('body').style.overflow = 'auto';
        delete this.target;
    }

    show() {
        this.image = new ImageViewerItem(this, this.data.file);
    }

}
