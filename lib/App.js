import Config from './Global/Config.js';
import Store from './Store/index.js';

export default class App extends MODULECLASS {
    constructor(parent) {
        super(parent);

        return new Promise(resolve => {
            this.app = this;

            // config
            new Config(this)
                .then(config => {
                    this.config = config;
                    // store
                    return new Store(this);
                })
                .then(store => {
                    this.store = store;
                    resolve(this);
                });
        });

    }
}