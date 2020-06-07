import Route from '../Route.js';

export default class ImageRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.store = this.app.store;

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
            const niceImage = extractedPath.join('/');
            extractedPath = extractedPath.filter((p, i) => i < extractedPath.length - 1).join('/');
            const folder = `${this.store.rootPath}/${extractedPath}`;

            this.store
                .collect(folder, true, ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'], true, 1)
                .then(data => {
                    if (data) {
                        const aggregated = data.aggregate();
                        const image = data.childs.filter(i => i.pathExtracted === niceImage)[0];

                        if (image) {
                            let file = image.aggregate();
                            if (file.type === 'image') {
                                image.readExif().then(() => {
                                    res.json({
                                        nicePath: nicePath,
                                        niceImage: niceImage,
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
