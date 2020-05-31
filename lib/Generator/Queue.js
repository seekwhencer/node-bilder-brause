export default class Queue extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
    }

    add(file) {
        this.emit('add', file);
    }
}
