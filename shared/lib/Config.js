import Module from './Module.js';
import fs from 'fs-extra';
import path from 'path';

export default class Config extends Module {
    constructor(parent) {
        super(parent);

        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.label = 'CONFIG';

            LOG(this.label, 'INIT');

            this.path = path.resolve(`${APP_DIR}/../config`);

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
        const appConfigFile = `${this.path}/app.json`;
        return fs.readJson(appConfigFile)
            .then(appConfig => {
                this.appConfig = appConfig;
                this.appConfig.env ? global.ENV = this.appConfig.env : null; // reset the environment
                this.file = `${this.path}/${ENV}.json`;
                LOG(this.label, 'APP LOADED');
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

                LOG(this.label, 'ENVIRONMENT LOADED');
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }
}
