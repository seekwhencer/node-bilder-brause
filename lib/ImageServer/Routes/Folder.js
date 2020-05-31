import Route from '../Route.js';

export default class FolderRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/folder', (req, res) => {
            const nicePath = this.nicePath(req.path);
            const extractedPath = this.extractPath(req.path, 'folder/');
            const data = this.app.store.data;

            res.json({
                nicePath: nicePath,
                extractedPath: extractedPath,
                data: data.aggregate()
            });
        });

        this.router.get(/(.+\/)?folder\/(.+)/i, (req, res) => {
            const nicePath = this.nicePath(req.path);
            const extractedPath = this.extractPath(req.path, 'folder/');
            const data = this.app.store.getFolder(extractedPath);

            res.json({
                nicePath: nicePath,
                extractedPath: extractedPath,
                data: data.aggregate()
            });
        });

        return this.router;
    }
}

