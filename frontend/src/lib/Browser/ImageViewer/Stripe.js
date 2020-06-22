import StripeTemplate from './Templates/Stripe.html';
import StripeItem from "./StripeItem.js";

export default class Stripe extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        console.log('>>> INIT FOLDER STRIPE');
        this.urlBase = this.app.urlBase;
        this.urlFolderBase = this.app.urlFolderBase;
        this.urlImageBase = this.app.urlImageBase;
        this.urlMediaBase = this.app.urlMediaBase;

        this.open();
    }

    open() {
        this.remove();
        this.target = this.toDOM(StripeTemplate({
            scope: {}
        }));
        this.parent.target.prepend(this.target);
        this.draw();
    }

    draw() {
        this.images = [];
        this.parent.parent.folder.images.forEach(i => {
            const imageItem = new StripeItem(this, i.options);
            this.images.push(imageItem);
        });
        this.calcStripWidth();
    }

    close() {
        this.remove();
    }

    remove() {
        this.target ? this.target.remove() : null;
    }

    calcStripWidth() {
        const imageBox = this.images[0].target.getBoundingClientRect();
        console.log('>>>>>>', imageBox);
    }
}
