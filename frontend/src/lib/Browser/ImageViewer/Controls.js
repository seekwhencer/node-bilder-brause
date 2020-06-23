import ControlsTemplate from './Templates/Controls.html';

export default class Controls extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.target = this.toDOM(ControlsTemplate({
            scope: {

            }
        }));
        this.parent.target.prepend(this.target);

        this.prevElement = this.target.querySelector('[data-prev]');
        this.prevElement.onclick = () => this.prev();

        this.nextElement = this.target.querySelector('[data-next]');
        this.nextElement.onclick = () => this.next();

        this.closeElement = this.target.querySelector('[data-close]');
        this.closeElement.onclick = () => this.close();

        this.layoutElement = this.target.querySelector('[data-layout]');
        this.layoutElement.onclick = () => this.toggleLayout();

        this.prevElement.show = this.nextElement.show = function () {
            this.classList.remove('hidden');
        }
        this.prevElement.hide = this.nextElement.hide = function () {
            this.classList.add('hidden');
        }
    }

    prev() {
        let previousImagePath;
        if (this.parent.images[this.parent.imageIndex - 1]) {
            previousImagePath = this.parent.images[this.parent.imageIndex - 1].options.pathExtracted;
        } else {
            previousImagePath = this.parent.images[0].options.pathExtracted;
        }
        this.parent.parent.setLocationHash(previousImagePath);
    }

    next() {
        let nextImagePath;
        if (this.parent.images[this.parent.imageIndex + 1]) {
            nextImagePath = this.parent.images[this.parent.imageIndex + 1].options.pathExtracted;
        } else {
            nextImagePath = this.parent.images[this.parent.images.length - 1].options.pathExtracted;
        }
        this.parent.parent.setLocationHash(nextImagePath);
    }

    checkPrevNext() {
        !this.parent.images[this.parent.imageIndex - 1] ? this.prevElement.hide() : this.prevElement.show();
        !this.parent.images[this.parent.imageIndex + 1] ? this.nextElement.hide() : this.nextElement.show();
    }

    close() {
        this.remove();
        this.parent.remove();
    }

    remove(){
        this.target ? this.target.remove() : null;
    }

    toggleLayout() {
        if(this.parent.stripe){
            this.parent.closeStripe();
            this.layoutElement.classList.remove('down');
            this.layoutElement.classList.add('up');
        } else {
            this.parent.openStripe();
            this.layoutElement.classList.remove('up');
            this.layoutElement.classList.add('down');
        }
    }
}
