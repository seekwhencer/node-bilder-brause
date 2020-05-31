import Route from '../Route.js';

export default class MediaRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/media/:hash', (req, res) => {
            const hash = req.params.hash;

            res.json({
                hash: hash
            });
        });

        this.router.get('/media/:hash/:size', (req, res) => {
            const hash = req.params.hash;
            const size = req.params.size;

            res.json({
                hash: hash,
                size: size
            });
        });

        return this.router;
    }
}

