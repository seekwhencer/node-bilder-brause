import ImageViewerTemplate from './Templates/ImageViewer.html';
import ImageViewerItem from './Item.js';
import Controls from './Controls.js';
import Stripe from './Stripe.js';

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

            this.images = this.parent.folder.images;

            // create the controls
            this.controls = new Controls(this);
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
        // remove the previous displayed image
        this.previousImage ? this.previousImage.remove() : null;

        // remove the actual image
        if (this.image) {
            this.image.forget();
            this.previousImage = Object.assign(this.image, {});
        }

        this.image = new ImageViewerItem(this, this.data.file);
        this.findImageIndex();
    }

    prev() {
        this.controls.prev();
    }

    next() {
        this.controls.next();
    }

    findImageIndex() {
        this.imageIndex = this.images.findIndex(i => i.options.filePath === this.image.options.filePath);
        this.controls.checkPrevNext();
    }

    showStripe() {
        this.stripe ? this.stripe.remove() : null;
        this.stripe = new Stripe(this);
        this.target.classList.add('stripe');
    }

}
