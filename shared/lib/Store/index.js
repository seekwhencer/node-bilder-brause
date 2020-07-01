import fs from 'fs-extra';
import path from 'path';
import Image from './Image.js';
import Folder from './Folder.js';

export default class Store extends NBBMODULECLASS {
    constructor(parent) {
        super(parent);

        return new Promise((resolve, reject) => {
            this.label = 'STORE |';
            this.options = this.app.config.store;
            this.rootPath = P(`${this.options.rootPath}`);
            this.thumbnailPath = P(`${this.options.thumbnailPath}`);
            this.includes = this.app.config.media.extensions.images;

            LOG(this.label, 'INIT');

            this.createFolder(this.thumbnailPath);

            // reads initally the complete tree! beware!
            if (this.options.loadTreeOnStartup === true) {
                this
                    .collect(this.rootPath, true, this.includes, true)
                    .then(data => {
                        this.data = data;
                        resolve(this);
                    });
            } else {
                resolve(this);
            }
        });
    }

    //
    createFolder(folder) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    }

    // fetch folder and files tree from disk
    collect(folder, recursive, includes, withDirs, depth) {
        return new Promise((resolve, reject) => {
            let rootFolderOptions = {
                id: 'rootfolder',
                path: '',
                folderName: ''
            };

            if (folder) {
                const folderName = folder.split('/')[folder.split('/').length - 1];
                rootFolderOptions = {
                    id: folderName,
                    path: folder,
                    folderName: folderName
                };
            }
            const data = new Folder(this, rootFolderOptions);

            // the complete folder content
            data.childs = this.readFolder(folder, recursive, includes, withDirs, depth);

            if (data.childs) {
                resolve(data);
            } else {
                reject('Nothing found in place.');
            }
        });
    }

    // grab a single file
    grab(itemPath) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(itemPath)) {
                reject(`${itemPath} NOT EXISTS`);
            }

            const collection = [];
            const xstat = fs.statSync(itemPath);
            const xstatItem = {
                atime: 'at' + xstat.atime.getTime(),
                mtime: 'mt' + xstat.mtime.getTime(),
                ctime: 'ct' + xstat.ctime.getTime(),
                btime: `bt${xstat.birthtime.getTime()}`
            };
            let item = false;

            // the file
            if (!xstat.isDirectory()) {
                const fileName = path.basename(itemPath).replace(path.extname(itemPath), '');
                const extension = path.extname(itemPath).replace('.', '');

                const regexExtensions = new RegExp(this.includes.join("|"), "i");
                if (regexExtensions.test(extension)) {
                    item = new Image(this, {
                        id: fileName,
                        filePath: itemPath,
                        fileName: fileName,
                        extension: extension,
                        size: xstat.size,
                        ...xstatItem
                    });
                }
            }
            resolve(item);
        });
    }

    stat(itemPath) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(itemPath)) {
                reject('Not Found');
            } else {
                const xstat = fs.statSync(itemPath);
                const xstatItem = {
                    type: xstat.isDirectory() ? 'folder' : 'file',
                    atime: 'at' + xstat.atime.getTime(),
                    mtime: 'mt' + xstat.mtime.getTime(),
                    ctime: 'ct' + xstat.ctime.getTime(),
                    btime: `bt${xstat.birthtime.getTime()}`
                };
                resolve(xstatItem);
            }
        });
    }

    // walk thru the existing tree to the given folder
    // @TODO - die quelle dynamisch machen, nicht nur "this.data" - aber von der sache ist diese funktion obsolete
    getFolder(folder) {
        let foundFolder = this.data;
        folder.forEach(f => {
            foundFolder ? foundFolder.childs ? foundFolder.childs.length > 0 ? foundFolder = foundFolder.childs.filter(child => child.id === f)[0] : null : null : null;
        });
        return foundFolder;
    }

    // walk thru the disk tree and fetch it
    readFolder(folder, recursive, includes, withDirs, depth) {
        const walk = (folder, recursive, level) => {
            let collection = [];

            if (fs.existsSync(folder)) {
                const dir = fs.readdirSync(folder);

                dir.forEach(i => {
                    let itemPath = `${folder}/${i}`;

                    if (fs.existsSync(itemPath)) {

                        try {
                            const xstat = fs.statSync(itemPath);
                            const xstatItem = {
                                atime: 'at' + xstat.atime.getTime(),
                                mtime: 'mt' + xstat.mtime.getTime(),
                                ctime: 'ct' + xstat.ctime.getTime(),
                                btime: `bt${xstat.birthtime.getTime()}`
                            };
                            let item = false;

                            // the directories
                            if (xstat.isDirectory()) {
                                if (withDirs === true || withDirs === 'only') {
                                    let folderName = path.basename(itemPath);

                                    item = new Folder(this, {
                                        id: folderName,
                                        path: itemPath,
                                        folderName: folderName,
                                        ...xstatItem
                                    });

                                    if (recursive === true || level < depth) {
                                        LOG(this.label, 'DEPTH', level, itemPath);
                                        item.childs = walk(itemPath, recursive, level + 1);
                                    }

                                    collection.push(item);
                                }
                            }

                            // the files
                            if (!xstat.isDirectory() && withDirs !== 'only') {
                                let fileName = path.basename(itemPath).replace(path.extname(itemPath), '');
                                let extension = path.extname(itemPath).replace('.', '');

                                const regexExtensions = new RegExp(includes.join("|"), "i");
                                if (regexExtensions.test(extension)) {
                                    item = new Image(this, {
                                        id: fileName,
                                        filePath: itemPath,
                                        fileName: fileName,
                                        extension: extension,
                                        size: xstat.size,
                                        ...xstatItem
                                    });

                                    collection.push(item);
                                }
                            }

                        } catch (err) {
                            LOG('NOT READABLE', itemPath, err);
                            collection = walk(itemPath, recursive, level + 1);
                        }
                    } else {
                        LOG('NOT EXISTS', itemPath);
                        collection = walk(itemPath, recursive, level + 1);
                    }


                });
            } else {
                LOG('NOT EXISTS ', folder);
            }

            return collection;
        };

        return walk(folder, recursive, 0);
    };

    aggregateIncludes() {
        LOG('>>> AGREGATE INCLUDES', this.options);
    }

}
