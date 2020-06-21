import Route from '../Route.js';

export default class ImageRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.store = this.app.store;
        this.includes = this.app.config.media.extensions.images;

        this.router.get('/image', (req, res) => {
            const nicePath = this.nicePath(req.path);
            const extractedPath = this.extractPath(req.path, 'folder/').join('/');
            const data = this.app.store.data;

            res.json({
                nicePath: nicePath,
                extractedPath: extractedPath,
                data: data.aggregate()
            });
        });

        this.router.get(/(.+\/)?image\/(.+)/i, (req, res) => {
            const nicePath = this.nicePath(req.path);
            let extractedPath = this.extractPath(req.path, 'image/');
            const fileName = extractedPath[extractedPath.length - 1];
            extractedPath.pop();
            const folder = `${this.store.rootPath}/${extractedPath.join('/')}`;
            const filePath = `${folder}/${fileName}`;

            this.store
                .grab(filePath)
                .then(image => {
                    if (image) {
                        const aggregated = image.aggregate();

                        let file = image.aggregate();
                        if (file.type === 'image') {
                            image.readExif().then(() => {
                                res.json({
                                    nicePath: nicePath,
                                    extractedPath: extractedPath,
                                    file: file,
                                    exif: image.exif,
                                    data: aggregated
                                });
                            });
                        }

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
