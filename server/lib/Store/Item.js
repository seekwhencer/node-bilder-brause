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

    get hash() {
        if (this.type === 'image') {
            return Crypto.createHash('md5').update(`${this.ctime}${this.size}${this.id}`).digest("hex");
        } else {
            return Crypto.createHash('md5').update(`${this.ctime}${this.id}`).digest("hex");
        }
    }
};
