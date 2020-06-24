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
        if (this.type === 'image') {
            this.hash = Crypto.createHash('md5').update(`${this.ctime}${this.size}${this.id}`).digest("hex");
        } else {
            this.hash = Crypto.createHash('md5').update(`${this.ctime}${this.id}`).digest("hex");
        }
    }

    get hash() {
        return this._hash;
    }

    set hash(value) {
        this._hash = value;
    }
};
