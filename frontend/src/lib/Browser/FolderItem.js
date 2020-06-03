import FolderItemTemplate from './Templates/FolderItem.html';

export default class FolderItem extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'FOLDERITEM';
            this.options = options;

            this.target = this.toDOM(FolderItemTemplate({
                scope: {
                    name: this.options.folderName
                }
            }));

            this.target.onclick = e => this.select(e);

            this.parent.target.append(this.target);

            resolve();
        });
    }

    select(e) {
        this.parent.parent.setLocationHash(encodeURI(this.options.pathExtracted))
    }
}
