import FileItemTemplate from './Templates/FolderItem.html';

export default class FileItem extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.options = options;

        this.target = this.toDOM(FileItemTemplate({
            scope: {
                name: this.options.fileName
            }
        }));

        this.target.onclick = e => this.select(e);
        this.parent.target.append(this.target);
    }

    select(e) {
        this.parent.parent.setLocationHash(this.options.pathExtracted)
    }
}
