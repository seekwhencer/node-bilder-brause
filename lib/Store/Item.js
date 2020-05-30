import Crypto from 'crypto';

export default class Item extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.atime = options.atime;
        this.mtime = options.mtime;
        this.ctime = options.ctime;

        this.hash = Crypto.createHash('md5').update(`${this.atime} ${this.mtime} ${this.ctime}`).digest("hex");
    }
};