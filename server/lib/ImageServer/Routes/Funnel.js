import Route from '../Route.js';
import fs from 'fs-extra';
import path from 'path';

export default class FunnelRoute extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.store = this.app.store;
        this.generator = this.app.generator;

        this.router.get('/funnel', (req, res) => {
            const redirectUrl = `/${this.parent.options.rootURLPath}/folder`;
            res.redirect(301, redirectUrl);
        });


        this.router.get(/(.+\/)?funnel\/(.+)/i, (req, res) => {
            const nicePath = this.nicePath(req.path);
            let extractedPath = this.extractPath(nicePath, 'funnel/');
            extractedPath = extractedPath.join('/');

            const itemPath = path.resolve(this.store.rootPath, extractedPath);
            let endpoint = '';

            LOG('FUNNEL GET ITEM PATH:', itemPath);

            this.store
                .stat(itemPath)
                .then(itemStats => {
                    if (itemStats.type === 'folder') {
                        endpoint = 'folder';
                    }
                    if (itemStats.type === 'file') {
                        endpoint = 'image';
                    }
                    const redirectUrl = `/${this.parent.options.rootURLPath}/${endpoint}/${extractedPath}`;
                    res.redirect(301, redirectUrl);
                })
                .catch(error => {
                    res.json({
                        message: error,
                        nicePath,
                        extractedPath,
                        itemPath
                    });
                });


        });

        return this.router;
    }
}

