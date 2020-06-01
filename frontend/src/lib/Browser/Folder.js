import FolderTemplate from './Templates/Folder.html';

import FolderItem from './FolderItem.js';
import ImageItem from './ImageItem.js';

export default class Folder extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'FOLDER';
            this.options = options;

            this.urlFolderBase = this.app.urlFolderBase;
            this.urlImageBase = this.app.urlImageBase;
            this.urlMediaBase = this.app.urlMediaBase;

            // fetch the entry url when the app is ready
            this.app.on('ready', () => this.parent.getLocationHash());

            // fetch the specified folder on a hash change
            this.parent.on('hashchange', () => this.get());

            //
            this.on('data', data => this.draw(data));

            resolve();
        });

    }

    get() {
        let urlPath = this.parent.locationExtracted.join('/');
        let url = `${this.urlFolderBase}`;
        urlPath ? url = `${url}/${urlPath}` : null;

        this
            .fetch(url)
            .then(folderData => this.emit('data', folderData));
    }

    draw(data) {
        this.remove();

        this.target = this.toDOM(FolderTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        const folders = data.data.childs.filter(c => c.type === 'folder');
        const images = data.data.childs.filter(c => c.type === 'image');

        console.log(this.label, 'FOLDERS', folders.length);
        console.log(this.label, 'FILES', images.length);

        // first the folders
        if (folders.length > 0)
            folders.forEach(folderData => {
                const folderItem = new FolderItem(this, folderData);
                this.items.push(folderItem);
            });

        // second the files
        if (images.length > 0)
            images.forEach(fileData => {
                const imageItem = new ImageItem(this, fileData);
                this.items.push(imageItem);
            });
    }

    remove() {
        this.target ? this.target.remove() : null;
    }

}
