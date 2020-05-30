import Route from '../Route.js';

export default class FolderRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/folder', (req, res) => {
            res.json({
                message: this.nicePath(req.path)
            });
        });

        this.router.get(/(.+\/)?folder\/(.+)/i, (req, res) => {
            const nicePath = this.nicePath(req.path);
            const extractedPath = this.extractPath(req.path, 'folder/');
            const data = this.app.store.getFolder(extractedPath);

            res.json({
                nicePath: nicePath,
                extractedPath: extractedPath,
                data: {
                    type: data.type,
                    id: data.id,
                    folderName: data.folderName,
                    hash: data.hash,
                    path: data.path,
                    pathExtracted: data.pathExtracted,
                    pathCrumped: data.pathCrumped,
                    uri: data.uri
                }
            });
        });

        return this.router;
    }
}


