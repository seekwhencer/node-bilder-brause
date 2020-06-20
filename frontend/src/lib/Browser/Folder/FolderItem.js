import FolderItemTemplate from './Templates/FolderItem.html';
import FolderImageItem from './FolderImage.js';

export default class FolderItem extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'FOLDERITEM';

        this.options = options;

        this.folders = this.options.childs.filter(c => c.type === 'folder');
        this.images = this.options.childs.filter(c => c.type === 'image');

        this.target = this.toDOM(FolderItemTemplate({
            scope: {
                name: this.options.folderName,
                count: {
                    folders : this.folders.length,
                    images: this.images.length
                }
            }
        }));

        this.target.onclick = e => this.select(e);
        this.parent.foldersElement.append(this.target);
        this.exposeThumbnail();
    }

    select(e) {
        this.parent.parent.setLocationHash(encodeURI(this.options.pathExtracted))
    }

    exposeThumbnail() {
        this.images = this.options.childs.filter(c => c.type === 'image');
        if (this.images.length === 0) {
            return;
        }
        this.image = new FolderImageItem(this, this.images[0]);
    }
}
