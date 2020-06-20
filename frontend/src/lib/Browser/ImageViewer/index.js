import ImageViewerTemplate from './Templates/ImageViewer.html';
import ImageViewerItem from './Item.js';


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

            this.prevElement = this.target.querySelector('[data-prev]');
            this.prevElement.onclick = () => this.prev();

            this.nextElement = this.target.querySelector('[data-next]');
            this.nextElement.onclick = () => this.next();

            this.closeElement = this.target.querySelector('[data-close]');
            this.closeElement.onclick = () => this.close();

            this.prevElement.show = this.nextElement.show = function () {
                this.classList.remove('hidden');
            }
            this.prevElement.hide = this.nextElement.hide = function () {
                this.classList.add('hidden');
            }

            this.images = this.parent.folder.images;
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

        // duplicate the actual image
        this.image ? this.previousImage = Object.assign(this.image, {}) : null; // copy the image

        if (this.previousImage) {
            this.previousImage ? this.previousImage.draw() : null;
            this.previousImage.target.classList.add('previous');
        }

        // remove the actual image
        this.image ? this.image.remove() : null;

        this.image = new ImageViewerItem(this, this.data.file);
        this.findImageIndex();
    }

    prev() {
        let previousImagePath;
        if (this.images[this.imageIndex - 1]) {
            previousImagePath = this.images[this.imageIndex - 1].options.pathExtracted;
        } else {
            previousImagePath = this.images[0].options.pathExtracted;
        }
        this.parent.setLocationHash(previousImagePath);
    }

    next() {
        let nextImagePath;
        if (this.images[this.imageIndex + 1]) {
            nextImagePath = this.images[this.imageIndex + 1].options.pathExtracted;
        } else {
            nextImagePath = this.images[this.images.length - 1].options.pathExtracted;
        }

        this.parent.setLocationHash(nextImagePath);
    }

    findImageIndex() {
        this.imageIndex = this.images.findIndex(i => i.options.filePath === this.image.options.filePath);
        this.checkPrevNext();
    }

    checkPrevNext() {
        !this.images[this.imageIndex - 1] ? this.prevElement.hide() : this.prevElement.show();
        !this.images[this.imageIndex + 1] ? this.nextElement.hide() : this.nextElement.show();
    }
}
