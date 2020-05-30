import Route from '../Route.js';

export default class ImageRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/image', (req, res) => {
            res.json({
                message: this.nicePath(req.path)
            });
        });

        this.router.get(/(.+\/)?image\/(.+)/i, (req, res) => {
            res.json({
                message: this.nicePath(req.path)
            });
        });

        return this.router;
    }
}