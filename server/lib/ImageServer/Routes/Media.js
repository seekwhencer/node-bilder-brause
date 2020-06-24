import Route from '../Route.js';
import fs from 'fs-extra';

export default class MediaRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.store = this.app.store;
        this.generator = this.app.generator;

        this.router.get('/media', (req, res) => {
            const hash = req.params.hash;

            res.json({
                hash: hash
            });
        });

        this.router.get(/(.+\/)?media\/original\/(.+)/i, (req, res) => {
            const nicePath = this.nicePath(req.path);
            let extractedPath = this.extractPath(nicePath, 'media/');
            const size = extractedPath[0];
            const fileName = extractedPath[extractedPath.length - 1];
            extractedPath = extractedPath.filter((p, i) => i > 0).filter((p, i) => i < extractedPath.length - 2).join('/');
            const folder = `${this.store.rootPath}/${extractedPath}`;
            const filePath = `${folder}/${fileName}`;

            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
            } else {
                res.end();
            }
        });

        this.router.get(/(.+\/)?media\/(.+)/i, (req, res) => {
            const nicePath = this.nicePath(req.path);
            let extractedPath = this.extractPath(nicePath, 'media/');
            const size = extractedPath[0];
            const fileName = extractedPath[extractedPath.length - 1];

            extractedPath = extractedPath.filter((p, i) => i > 0).filter((p, i) => i < extractedPath.length - 2).join('/');

            const folder = `${this.store.rootPath}/${extractedPath}`;
            const niceMedia = `${extractedPath}/${fileName}`;
            const filePath = `${folder}/${fileName}`;

            this.store
                .grab(filePath)
                .then(image => {
                    image.size = size;
                    const thumbnail = `${image.thumbnailPath}/${image.hash}_${image.size}.jpg`;

                    if (fs.existsSync(thumbnail)) {
                        res.sendFile(thumbnail);
                    } else {
                        const job = this.generator.addJob(image);
                        job.on('complete', () => res.sendFile(thumbnail));
                    }
                })
                .catch(() => {
                    res.end();
                });


        });

        return this.router;
    }
}

