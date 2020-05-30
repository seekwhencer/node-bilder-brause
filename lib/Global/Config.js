import Module from '../Global/Module.js';
import fs from 'fs-extra';

export default class Config extends Module {
    constructor(parent) {
        super(parent);

        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.label = 'CONFIG';

            LOG(this.label, 'INIT');

            this.path = `${APP_DIR}/config`;

            this.loadAppConfig()
                .then(() => {
                    return this.load();
                })
                .then(() => {
                    resolve(this.data);
                });
        });
    }

    loadAppConfig() {
        const appConfigFile = `${APP_DIR}/config/app.json`;
        return fs.readJson(appConfigFile)
            .then(appConfig => {
                this.appConfig = appConfig;
                this.appConfig.env ? global.ENV = this.appConfig.env : null; // reset the environment
                this.file = `${this.path}/${ENV}.json`;
                LOG(this.label, 'APP-CONFIG LOADED:', '\n', this.appConfig);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    load() {
        return fs.readJson(this.file)
            .then(configData => {
                this.data = {
                    ...this.appConfig, // merge super global static app config
                    ...configData
                };

                LOG(this.label, 'LOADED:', '\n', configData);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }
}