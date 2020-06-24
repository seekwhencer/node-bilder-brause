import Route from '../Route.js';
import formidable from 'formidable';
import fs from "fs-extra";

export default class UploadRoute extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.post('/upload/:size', (req, res) => {

            //@TODO empfange das thubnail und speichere es weg

            const form = new formidable
                .IncomingForm()
                .parse(req, (err, fields) => {
                    console.log('fields:', fields);
                    fields.size ? this.size = fields.size : null;
                    fields.hash ? this.hash = fields.hash : null;
                });

            form
                .on('fileBegin', (name, file) => {
                    //const thumbnailPath = this.thumbnailPath;
                    LOG('>>> FILE BEGIN', this.filePath);
                    file.path = this.filePath;
                })
                .on('file', (name, file) => {
                    //LOG('THUMBNAIL RECEIVED');
                })
                .on('aborted', () => {
                    ERROR('THUMBNAIL UPLOAD ABORTED')
                })
                .on('error', (err) => {
                    ERROR('THUMBNAIL RECEIVING ERROR:', err)
                    throw err
                })
                .on('end', () => {
                    res.json({
                        message: this.nicePath(req.path)
                    });
                });
        });

        return this.router;
    }

    extractThumbnailPaths(digits, count) {
        let chunks = [];
        for (let i = 0, e = digits; i < this.hash.length; i += digits, e += digits) {
            chunks.push(this.hash.substring(i, e));
        }
        chunks = chunks.filter((block, i) => i < count);
        return chunks;
    }

    set hash(value) {
        this._hash = value;
        this.thumbnailPathsCrumped = this.extractThumbnailPaths(this.app.config.store.thumbnailPathSplitDigits, this.app.config.store.thumbnailPathSplitCount);
        this.thumbnailPath = `${this.app.store.thumbnailPath}/${this.thumbnailPathsCrumped.join('/')}`;
        this.filePath = `${this.thumbnailPath}/${this.hash}_${this.size}.jpg`;
        fs.mkdirpSync(this.thumbnailPath);
        LOG('>>>?!?', this.filePath);
    }

    get hash(){
        return this._hash;
    }

}


