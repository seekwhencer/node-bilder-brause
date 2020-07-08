import FolderTemplate from './Templates/Folder.html';
import FolderListing from './FolderListing.js';
import ItemListing from './ItemListing.js';
import LatestListing from "./LatestListing.js";

export default class Folder extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'FOLDER';
        this.options = options;
        this.browser = this.parent;

        this.urlBase = this.app.urlBase;
        this.urlFolderBase = this.app.urlFolderBase;
        this.urlImageBase = this.app.urlImageBase;
        this.urlMediaBase = this.app.urlMediaBase;

        this.maxConcurrentImageRequests = 3;
        this.concurrentImageRequests = 0;

        this.location = ''; // the clear path
    }

    set(data) {
        this.data = data;

        // suppress redraw if drew before
        if (this.location === this.data.data.pathExtracted)
            return;

        this.draw();
    }

    draw() {
        if (this.data.file) {
            !this.target ? this.drawFolder() : null; // if the folder was loaded
        } else {
            this.drawFolder(); // on a full deep link
        }
    }

    drawFolder() {
        this.location = this.data.data.pathExtracted;
        this.remove();

        this.target = this.toDOM(FolderTemplate({
            scope: {}
        }));
        this.browser.target.append(this.target);

        //
        this.folderListing = new FolderListing(this);
        this.itemListing = new ItemListing(this);
        //this.latestListing = new LatestListing(this); //@TODO
    }

    drawImage() {
        console.log('>>> DRAW IMAGE');
    }

    remove() {
        this.target ? this.target.remove() : null;
        this.folderListing ? this.folderListing.remove() : null;
        //this.itemListing ? this.itemListing.remove() : null;
    }
}
