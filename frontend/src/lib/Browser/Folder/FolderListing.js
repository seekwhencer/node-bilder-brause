import FolderItem from "./FolderItem.js";

export default class FolderListing extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'FOLDER LISTING';
        this.options = options;
        this.target = this.parent.target.querySelector('[data-folders]');
        this.set();
    }

    set(childs) {
        if (childs) {
            this.data = childs.filter(c => c.type === 'folder');
        } else {
            this.data = this.parent.data.data.childs.filter(c => c.type === 'folder');
        }

        this.order();

        this.folders = [];
        if (this.data.length > 0) {
            this.data.forEach(folderData => {
                const folderItem = new FolderItem(this, folderData);
                this.folders.push(folderItem);
            });
            const firstFolderWithImage = this.folders.filter(f => f.image ? f : null)[0];
            firstFolderWithImage ? firstFolderWithImage.image.load() : null;
        }
        this.order();
        console.log(this.label, 'FOLDERS', this.folders.length);
    }

    order(byKey) {
        !byKey ? byKey = 'folderName' : null;
        this.data = ksortObjArray(this.data, byKey);
    }

    remove() {
        this.data ? delete this.data : null;
        this.folders ? delete this.folders : null;
    }
}
