import fs from 'fs-extra';
import Crypto from 'crypto';
import path from 'path';
import Image from './Image.js';
import Folder from './Folder.js';

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
                .readDir(this.rootPath, true, ['jpg', 'JPG', 'jpeg', 'JPEG'], true)
                .then(data => {
                    this.data = data;
                    resolve(this);
                });
        });
    }

    createFolder(folder) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    }

    readDir(folder, recursive, includes, withDirs) {
        return new Promise((resolve, reject) => {
            const data = {
                childs: this.readFolder(folder, recursive, includes, withDirs)
            };
            if (data.childs) {
                resolve(data);
            } else {
                reject('Nothing found in place.');
            }
        });
    }

    getFolder(folder) {
        let foundFolder = this.data.childs;
        folder.forEach(f => {
            foundFolder = foundFolder.filter(child => child.id === f)[0];
        });
        return foundFolder;
    }

    readFolder(folder, recursive, includes, withDirs) {

        const walk = (folder, recursive) => {
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
                                ctime: 'ct' + xstat.ctime.getTime()
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

                                    if (recursive === true) {
                                        item.childs = walk(itemPath, recursive);
                                    }

                                    collection.push(item);
                                }
                            }

                            // the files
                            if (!xstat.isDirectory() && withDirs !== 'only') {
                                let fileName = path.basename(itemPath).replace(path.extname(itemPath), '');
                                let extension = path.extname(itemPath).replace('.', '');

                                if (includes.includes(extension)) {

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
                            collection = walk(itemPath, recursive);
                        }
                    } else {
                        LOG('NOT EXISTS', itemPath);
                        collection = walk(itemPath, recursive);
                    }
                });
            } else {
                LOG('NOT EXISTS ', folder);
            }

            return collection;
        };

        return walk(folder, recursive);
    };
}
