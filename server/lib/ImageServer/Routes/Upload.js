import Route from '../Route.js';
import formidable from 'formidable';
import fs from "fs-extra";

export default class UploadRoute extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.post('/upload/:size', (req, res) => {

            //@TODO empfange das thubnail und speichere es weg

            const form = new formidable.IncomingForm();

            form.parse(req, (err, fields, files) => {
                fields.size ? this.size = fields.size : null;
                fields.hash ? this.hash = fields.hash : null;
                files ? this.files = files : null;
            });

            if (this.files) {
                form
                    .on('aborted', () => {
                        ERROR('THUMBNAIL UPLOAD ABORTED')
                    })
                    .on('error', (err) => {
                        ERROR('THUMBNAIL RECEIVING ERROR:', err)
                    });

                form.on('end', () => {
                    const temp_path = form.openedFiles[0].path;
                    fs.ensureDirSync(this.thumbnailPath);
                    fs.copy(temp_path, this.filePath, err => {
                        if (err) {
                            ERROR(this.label, err);
                        } else {
                            const image = this.app.generator.queue.filter(q => q.hash === this.hash)[0];
                            image.emit('complete');
                            res.end();
                        }
                    });
                });
            } else {
                res.end();
            }
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
        LOG('>>>?!?', this.thumbnailPath, this.filePath);
        fs.ensureDirSync(this.thumbnailPath);
    }

    get hash() {
        return this._hash;
    }

}


