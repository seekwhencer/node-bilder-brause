import ImageItem from "./ImageItem.js";

export default class LatestListing extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'LATEST LISTING';
        this.options = options;

        this.maxConcurrentImageRequests = this.parent.maxConcurrentImageRequests || 3;
        this.concurrentImageRequests = this.parent.concurrentImageRequests || 0;

        this.target = this.parent.target.querySelector('[data-latest]');
        this.set();
    }

    set(childs) {
        if (childs) {
            this.data = childs.filter(c => c.type === 'image');
        } else {
            this.data = this.parent.data.data.childs.filter(c => c.type === 'image');
        }

        this.order();

        this.images = [];
        if (this.data.length > 0) {
            this.data.forEach(fileData => {
                const imageItem = new ImageItem(this, fileData);
                this.images.push(imageItem);
            });

            // start loading chain with the first image
            // if the load is complete, the next image will be loaded...
            // first image to load

            this.images[0].load();
        }
    }

    order(byKey, direction) {
        !byKey ? byKey = 'btime' : null;
        !direction ? direction = 'DESC' : null;
        this.data = ksortObjArray(this.data, byKey);
        direction === 'DESC' ? this.data.reverse() : null;
    }

    remove() {
        this.data ? delete this.data : null;
        this.images ? delete this.images : null;
    }
}
