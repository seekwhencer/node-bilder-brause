import Route from '../Route.js';

export default class FolderRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.store = this.app.store;

        this.router.get('/folder', (req, res) => {
            const nicePath = this.nicePath(req.path);
            const extractedPath = this.extractPath(req.path, 'folder/').join('/');
            const data = this.app.store.data;

            res.json({
                nicePath: nicePath,
                extractedPath: extractedPath,
                data: data.aggregate()
            });
        });

        this.router.get(/(.+\/)?folder\/(.+)/i, (req, res) => {
            const nicePath = this.nicePath(req.path);
            const extractedPath = this.extractPath(req.path, 'folder/').join('/');
            const folder = `${this.store.rootPath}/${extractedPath}`;

            this.store
                .collect(folder, true, ['jpg', 'JPG', 'jpeg', 'JPEG'], true)
                .then(data => {
                    if (data) {
                        res.json({
                            nicePath: nicePath,
                            extractedPath: extractedPath,
                            data: data.aggregate()
                        });
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

