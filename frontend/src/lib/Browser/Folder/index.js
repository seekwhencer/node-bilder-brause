import FolderTemplate from './Templates/Folder.html';
import FolderListing from './FolderListing.js';
import ItemListing from './ItemListing.js';

export default class Folder extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'FOLDER';
        this.options = options;

        this.urlBase = this.app.urlBase;
        this.urlFolderBase = this.app.urlFolderBase;
        this.urlImageBase = this.app.urlImageBase;
        this.urlMediaBase = this.app.urlMediaBase;

        this.maxConcurrentImageRequests = 3;
        this.concurrentImageRequests = 0;
    }

    set(data) {
        this.data = data;
        // @TODO hier ne Weiche ob's nen folder ist oder daten kamen. ansonsten eins zurück
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
        this.remove();

        this.target = this.toDOM(FolderTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        //
        this.folderListing = new FolderListing(this);
        this.itemListing = new ItemListing(this);
    }

    drawImage() {
        console.log('>>> DRAW IMAGE');
    }

    remove() {
        this.target ? this.target.remove() : null;
        this.folderListing ? this.folderListing.remove() : null;
        this.itemListing ? this.itemListing.remove() : null;
    }
}
