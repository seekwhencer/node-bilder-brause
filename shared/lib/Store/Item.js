import Crypto from 'crypto';

export default class Item extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.options = options;

        this.atime = options.atime;
        this.btime = options.btime;
        this.mtime = options.mtime;
        this.ctime = options.ctime;
    }

    generateHash() {
        let toHash;
        if (this.type === 'image') {
            toHash = `${this.ctime}${this.options.fileName}${this.options.extension}`;
        } else {
            toHash = `${this.ctime}${this.options.folderName}`;
        }
        this.hash = Crypto.createHash('md5').update(toHash).digest("hex");
    }

    get hash() {
        return this._hash;
    }

    set hash(value) {
        this._hash = value;
    }
};
