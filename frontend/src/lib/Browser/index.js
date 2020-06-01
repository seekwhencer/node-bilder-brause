import BrowserTemplate from './Templates/Browser.html';

import Folder from './Folder.js';

export default class Browser extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'BROWSER';
            this.options = options;

            // listen on the location hash
            window.addEventListener("hashchange", () => this.getLocationHash(), false);

            // add the template container
            this.target = this.toDOM(BrowserTemplate({
                scope: {}
            }));
            this.parent.target.append(this.target);

            // create the folder class
            this.folder = new Folder(this);

            resolve();
        });

    }

    getLocationHash() {
        const locationURL = new URL(document.location);
        this.locationHash = locationURL.hash.replace(/#/,'');
        console.log(this.label, 'GOT LOCATION HASH', this.locationHash, this.locationExtracted);
    }

    setLocationHash(path){
        window.location.hash = `#${path}`;
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
