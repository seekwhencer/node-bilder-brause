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

        this.router.get(/(.+\/)?media\/(.+)/i, (req, res) => {
            const nicePath = this.nicePath(req.path);
            let extractedPath = this.extractPath(nicePath, 'media/');
            const size = extractedPath[0];
            const fileName = extractedPath[extractedPath.length - 1];

            extractedPath = extractedPath.filter((p, i) => i > 0).filter((p, i) => i < extractedPath.length - 2).join('/');

            const folder = `${this.store.rootPath}/${extractedPath}`;
            const niceMedia = `${extractedPath}/${fileName}`;

            this.store
                .collect(folder, false, ['jpg', 'JPG', 'jpeg', 'JPEG'], true, 0)
                .then(data => {
                    if (data) {
                        const media = data.childs.filter(i => i.pathExtracted === niceMedia)[0];
                        const file = media.aggregate();
                        file.size = size;

                        const thumbnail = `${file.thumbnailPath}/${file.hash}_${file.size}.jpg`;
                        if (fs.existsSync(thumbnail)) {
                            res.sendFile(thumbnail);
                        } else {
                            const job = this.generator.addJob(file);
                            job.on('complete', job => res.sendFile(thumbnail));
                        }
                    }
                });
        });

        return this.router;
    }
}

