import Route from '../Route.js';

export default class FolderRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);
        this.store = this.app.store;
        this.includes = this.app.config.media.extensions.images;

        //this.router.get(['/latest/:num', '/latest'], (req, res) => {
        this.router.get([/(.+\/)?latest\/(.+)/i, '/latest'], (req, res) => {
            const nicePath = this.nicePath(req.path);
            let extractedPath = this.extractPath(req.path, 'latest/').join('/');
            let fromFolder;
            extractedPath === 'latest' ? fromFolder = `${this.store.rootPath}` : fromFolder = `${this.store.rootPath}/${extractedPath}`;
            const num = parseInt(req.params.num) || 100;

            LOG('GETTING THE LATEST', num, 'IMAGES', extractedPath, fromFolder);

            this.store
                .collect(fromFolder, true, this.includes, true)
                .then(data => this.store.flat(data))
                .then(data => {
                    if (data) {
                        data = this.store.filterLatest(data, num);
                        res.json(data);
                    } else {
                        res.json({
                            nicePath: nicePath,
                            extractedPath: extractedPath,
                            data: false,
                            message: "jibt's wohl nicht..."
                        });
                    }

                });
        });

        return this.router;
    }
}

