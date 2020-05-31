const
    ramda = require('ramda'),
    path = require('path');


module.exports = class {
    constructor() {
        this.appPath = `${path.resolve(process.env.PWD)}/frontend`;

        this.defaults = {
            entry: {
                app: './src/app.js'
            },
            target: 'web'
        };
    };

    mergeConfig() {
        return ramda.mergeDeepLeft(this.config, this.defaults);
    }
};