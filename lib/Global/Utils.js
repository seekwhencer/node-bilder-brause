import path from 'path';
import fs from 'fs-extra';

global.P = (dir, rootDir) => {
    if (dir.substring(0, 1) === '/') {
        return path.resolve(dir);
    } else {
        if (rootDir) {
            return path.resolve(`${rootDir}/${dir}`);
        } else {
            return path.resolve(`${APP_DIR}/${dir}`);
        }

    }
};

global.PROP = (target, field, options) => {
    Object.defineProperty(target, field, {
        ...{
            enumerable: false,
            configurable: false,
            writable: true,
            value: false
        },
        ...options
    });
};

global.RDIRSYNCNESTED = function (folder, recursive, includes, withDirs) {

    const walk = (folder, recursive) => {
        let collection = [];

        if (fs.existsSync(folder)) {
            const dir = fs.readdirSync(folder);

            dir.forEach(i => {
                let itemPath = `${folder}/${i}`;

                if (fs.existsSync(itemPath)) {

                    try {
                        const xstat = fs.statSync(itemPath);
                        let item = false;

                        // the directories
                        if (xstat.isDirectory()) {
                            if (withDirs === true || withDirs === 'only') {
                                let folderName = path.basename(itemPath);
                                item = {
                                    id: folderName,
                                    path: itemPath,
                                    folderName: folderName,
                                    atime: 'at' + xstat.atime.getTime(),
                                    mtime: 'mt' + xstat.mtime.getTime(),
                                    ctime: 'ct' + xstat.ctime.getTime(),
                                };

                                if (recursive === true) {
                                    item.childs = walk(itemPath, recursive);
                                }

                                collection.push(item);
                            }
                        }

                        // the files
                        if (!xstat.isDirectory() && withDirs !== 'only') {
                            let filename = path.basename(itemPath).replace(path.extname(itemPath), '');
                            let extension = path.extname(itemPath).replace('.', '');

                            if (includes.includes(extension)) {
                                item = {
                                    id: filename,
                                    filePath: itemPath,
                                    fileName: filename,
                                    extension: extension,
                                    size: xstat.size,
                                    atime: 'at' + xstat.atime.getTime(),
                                    mtime: 'mt' + xstat.mtime.getTime(),
                                    ctime: 'ct' + xstat.ctime.getTime()
                                };

                                collection.push(item);
                            }
                        }

                    } catch (err) {
                        LOG('RDIRSYNC NOT READABLE', itemPath, err);
                        collection = walk(itemPath, recursive);
                    }
                } else {
                    LOG('RDIRSYNC NOT EXISTS', itemPath);
                    collection = walk(itemPath, recursive);
                }
            });
        } else {
            LOG('RDIRSYNC NOT EXISTS ', folder);
        }

        return collection;
    };

    return walk(folder, recursive);
};


global.FOLDERSYNC = function (folder) {
    if (fs.existsSync(folder)) {
        const dir = fs.readdirSync(folder);
        return dir;
    }
};