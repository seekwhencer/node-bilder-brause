export default class Log {
    constructor() {
        window.NBBLOG = console.log;
        console.log = this.log;
    }

    log() {
        if (!window.NBBOPTIONS)
            return;

        if (!window.NBBOPTIONS.debug)
            return;

        window.NBBLOG.apply(this, arguments);
    }
}
new Log();
