import fs from 'fs-extra';
import Crypto from 'crypto';

export default class Store extends MODULECLASS {
    constructor(parent) {
        super(parent);

        return new Promise((resolve, reject) => {
            this.label = 'STORE';
            this.options = this.app.config.store;
            this.rootPath = P(`${this.options.rootPath}`);
            this.thumbnailPath = P(`${this.options.thumbnailPath}`);

            LOG(this.label, 'INIT');

            this.createFolder(this.thumbnailPath);

            this
                .readDir(this.rootPath, true, ['jpg', 'JPG', 'jpeg', 'JPEG'], true, true)
                .then(data => {
                    this.data = data;
                    this.data = this._extractPaths(this.data);

                    LOG('>>>', data);
                    resolve(this);
                });
        });
    }

    createFolder(folder) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    }

    readDir(folder, recursive, includes, withDirs, nested) {
        return new Promise((resolve, reject) => {
            const data = RDIRSYNCNESTED(folder, recursive, includes, withDirs, nested);
            if (data) {
                resolve(data);
            } else {
                reject('Nothing found in place.');
            }
        });
    }

    _extractPaths(data) {
        return data.childs.map(d => { // d is a file or directory
            d.filePath ? d.pathExtracted = d.filePath.replace(`${this.rootPath}/`, '') : null;
            d.path ? d.pathExtracted = d.path.replace(`${this.rootPath}/`, '') : null;
            d.pathExtracted ? d.pathCrumped = d.pathExtracted.split('/') : null;
            d.childs ? d.childs.length === 0 ? delete d.childs : null : null;
            d.hash = Crypto.createHash('md5').update(`${d.atime} ${d.mtime} ${d.ctime}`).digest("hex");
            d.childs ? d.childs = this._extractPaths(d) : null;
            d.uri = encodeURI(d.pathCrumped.join('/')).replace(/^\//, '').replace(/\/$/, '');
            d.filePath ? d.thumbnailPathsCrumped = this._extractThumbnailPaths(d.hash, 3, 3) : null;
            d.filePath ? d.thumbnailPath = `${this.thumbnailPath}/${d.thumbnailPathsCrumped.join('/')}` : null;
        });
    }

    _extractThumbnailPaths(hash, count, digits) {
        let chunks = [];
        for (let i = 0, e = digits; i < hash.length; i += digits, e += digits) {
            chunks.push(hash.substring(i, e));
        }
        chunks = chunks.filter((block,i) => i < count);
        return chunks;
    }
}
