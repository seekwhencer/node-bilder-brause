import ImageItem from "./ImageItem.js";

export default class ItemListing extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ITEM LISTING';
        this.options = options;

        this.maxConcurrentImageRequests = this.parent.maxConcurrentImageRequests || 3;
        this.concurrentImageRequests = this.parent.concurrentImageRequests || 0;

        this.target = this.parent.target.querySelector('[data-files]');
        this.set();
    }

    set(childs) {
        if (childs) {
            this.data = childs.filter(c => c.type === 'image');
        } else {
            this.data = this.parent.data.data.childs.filter(c => c.type === 'image');
        }

        this.images = [];
        if (this.data.length > 0) {
            this.data.forEach(fileData => {
                const imageItem = new ImageItem(this, fileData);
                this.images.push(imageItem);
            });

            // start loading chain with the first image
            // if the load is complete, the next image will be loaded...
            // first image to load
            this.order();
            this.images[0].load();
        }
    }

    order(byKey, direction) {
        !byKey ? byKey = 'btime' : null;
        !direction ? direction = 'DESC' : null;
        this.images = ksortObjArray(this.images, byKey);

        direction === 'DESC' ? this.images.reverse() : null;
    }
}
