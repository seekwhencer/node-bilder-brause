import FolderTemplate from './Templates/Folder.html';

import FolderItem from './FolderItem.js';
import ImageItem from './ImageItem.js';

export default class Folder extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'FOLDER';
        this.options = options;

        this.urlBase = this.app.urlBase;
        this.urlFolderBase = this.app.urlFolderBase;
        this.urlImageBase = this.app.urlImageBase;
        this.urlMediaBase = this.app.urlMediaBase;

        // @TODO - not used?
        this.includes = {
            images: ['jpg', 'JPG', 'JPEG', 'jpeg', 'png', 'PNG']
        }
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
        this.foldersElement = this.target.querySelector('[data-folders]');
        this.filesElement = this.target.querySelector('[data-files]');

        let folders = this.data.data.childs.filter(c => c.type === 'folder');
        let images = this.data.data.childs.filter(c => c.type === 'image');

        folders = ksortObjArray(folders, 'folderName');
        images = ksortObjArray(images, 'btime');
        images.reverse();

        console.log(this.label, 'FOLDERS', folders.length);
        console.log(this.label, 'FILES', images.length);

        // first the folders
        this.folders = [];
        if (folders.length > 0)
            folders.forEach(folderData => {
                const folderItem = new FolderItem(this, folderData);
                this.items.push(folderItem);
                this.folders.push(folderItem);
            });

        // second the files
        this.images = [];
        if (images.length > 0)
            images.forEach(fileData => {
                const imageItem = new ImageItem(this, fileData);
                this.items.push(imageItem);
                this.images.push(imageItem);
            });
    }

    drawImage() {
        console.log('>>> DRAW IMAGE');
    }


    remove() {
        this.target ? this.target.remove() : null;
    }
}
