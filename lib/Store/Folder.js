import Item from './Item.js';

export default class Folder extends Item {
    constructor(parent, options) {
        super(parent, options);

        this.type = 'folder';
        this.id = options.id;
        this.path = options.path;
        this.folderName = options.folderName;

        this.pathExtracted = this.path.replace(`${this.parent.rootPath}/`, '');
        this.pathCrumped = this.pathExtracted.split('/');
        this.uri = encodeURI(this.pathCrumped.join('/')).replace(/^\//, '').replace(/\/$/, '');

    }
};