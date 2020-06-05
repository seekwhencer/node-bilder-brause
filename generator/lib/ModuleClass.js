import Events from './Events.js';
import Crypto from 'crypto';

export default class Module extends Events {
    constructor(parent) {
        super();
        parent ? this.parent = parent : null;
        this.parent ? this.parent.app ? this.app = this.parent.app : null : null;
        this.id = `${Crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`; // @TODO random hash
    }
}
