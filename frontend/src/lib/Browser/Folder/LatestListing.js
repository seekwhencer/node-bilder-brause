import ImageItem from "./ImageItem.js";

export default class LatestListing extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'LATEST LISTING';
        this.options = options;

        this.folder = this.parent;
        this.browser = this.folder.parent;
        this.itemListingOptions = this.folder.itemListing.optionsElement;

        this.target = this.parent.target.querySelector('[data-latest]');

        this.on('loading', url => {
            this.isLoading = true;
            this.itemListingOptions.emit('loading');
        });

        this.on('data', data => {
            this.isLoading = false;
            this.itemListingOptions.emit('data');
            //this.set(data.data.childs);
            this.folder.itemListing.set(data.data.childs);
        });
    }

    get() {
        if (this.isLoading)
            return;

        let urlPath = this.browser.locationExtracted.join('/');
        let url = `${this.browser.urlBase}/latest/${urlPath}`;
        this.emit('loading', url);
        this.fetch(url).then(data => this.emit('data', data));
    }
}
