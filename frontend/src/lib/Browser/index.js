import BrowserTemplate from './Templates/Browser.html';
import Folder from './Folder/index.js';
import PageTitle from './PageTitle.js';
import Breadcrumb from './Breadcrumb.js';
import ImageViewer from './ImageViewer/index.js';

export default class Browser extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'BROWSER';
            this.options = options;

            this.urlBase = this.app.urlBase;
            this.urlFolderBase = this.app.urlFolderBase;
            this.urlImageBase = this.app.urlImageBase;
            this.urlMediaBase = this.app.urlMediaBase;

            // listen on the location hash
            window.addEventListener("hashchange", () => this.getLocationHash(), false);

            // fetch the entry url when the app is ready
            this.app.on('ready', () => this.getLocationHash());

            // fetch the specified folder on a hash change
            this.on('hashchange', () => this.get());

            // work with the json response
            this.on('data', data => {
                console.log('>>> GOT DATA', data.data.type, data.data.id);

                this.pageTitle.set(data.data.folderName);
                this.breadcrumb.set(data.data);

                // on ANY data, the folder will be feeded with the data
                this.folder.set(data);

                // on ANY data, the viewer will be feeded with the data
                // and decides to open, if the data contains the "file" field
                this.imageViewer.set(data);
            });

            // add the template container
            this.target = this.toDOM(BrowserTemplate({
                scope: {}
            }));
            this.parent.target.append(this.target);

            // page title
            this.pageTitle = new PageTitle(this);

            // breadcrump
            this.breadcrumb = new Breadcrumb(this);

            // create the folder class
            this.folder = new Folder(this);

            // create the large view
            this.imageViewer = new ImageViewer(this);

            resolve();
        });

    }

    get() {
        this.stopLoadingAllResources();
        let urlPath = this.locationExtracted.join('/');
        let url = `${this.urlBase}/funnel/${urlPath}`;
        let followingRequestUrl = false;

        // if nothing is there before
        // override the url without the last item of it
        if (!this.folder.target) {
            console.log('>>> NOTHING HERE');
            followingRequestUrl = url;
            this.locationExtracted.pop();
            const urlPathWithoutFile = this.locationExtracted.join('/');
            url = `${this.urlBase}/funnel/${urlPathWithoutFile}`;
        }

        // on a deeplink to a file, the upper folder must be requested.
        // this happens here. if no folder contend exists, the folder will
        // be requested at first. then, after the request is done,
        // the image viewer request happens.
        this
            .fetch(url)
            .then(data => {
                this.emit('data', data);

                // if it is an first request
                if (followingRequestUrl) {
                    this
                        .fetch(followingRequestUrl)
                        .then(data => {
                            this.emit('data', data);
                        });
                }
            });
    }

    getLocationHash() {
        const locationURL = new URL(document.location);
        this.locationHash = locationURL.hash.replace(/#/, '');
        console.log(this.label, 'GOT LOCATION HASH', this.locationHash, this.locationExtracted);
    }

    setLocationHash(path) {
        window.location.hash = `#${path}`;
    }

    stopLoadingAllResources() {
        // @TODO - stop all loading resources
    }

    get locationHash() {
        return this._locationHash;
    }

    set locationHash(value) {
        this._locationHash = value;
        this.locationExtracted = this.locationHash.split('/');
        this.emit('hashchange');
    }
}
