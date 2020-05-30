import Route from '../Route.js';

export default class FolderRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/', (req, res) => {
            res.json({
                message: this.nicePath(req.path)
            });
        });

        return this.router;
    }
}


