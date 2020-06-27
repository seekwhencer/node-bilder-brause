import Crypto from 'crypto';

export default class Item extends MODULECLASS {
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
            toHash = `${this.ctime}${this.size}${this.options.fileName}${this.options.extension}`;
        } else {
            toHash = `${this.ctime}${this.id}`;
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
