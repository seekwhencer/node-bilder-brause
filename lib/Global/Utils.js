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

global.RDIRSYNC = function (folder, recursive, includes, withDirs) {
    let data = [];

    const walk = (folder, recursive) => {
        if (fs.existsSync(folder)) {
            const dir = fs.readdirSync(folder);

            dir.forEach(i => {
                let insert = folder + '/' + i;
                if (fs.existsSync(insert)) {
                    try {
                        const xstat = fs.statSync(insert);

                        // the files
                        if (!xstat.isDirectory() && withDirs !== 'only') {
                            let filename = path.basename(insert).replace(path.extname(insert), '');
                            let extension = path.extname(insert).replace('.', '');

                            if (includes.includes(extension)) {
                                const item = {
                                    id: filename,
                                    filePath: insert,
                                    fileName: filename,
                                    extension: extension,
                                    size: xstat.size,
                                    atime: 'at' + xstat.atime.getTime(),
                                    mtime: 'mt' + xstat.mtime.getTime(),
                                    ctime: 'ct' + xstat.ctime.getTime()
                                }
                                data.push(item);
                            }
                        }

                        // the directories
                        if (xstat.isDirectory()) {
                            if (withDirs === true || withDirs === 'only') {
                                let folderName = path.basename(insert);
                                const item = {
                                    id: folderName,
                                    path: insert,
                                    folderName: folderName,
                                    atime: 'at' + xstat.atime.getTime(),
                                    mtime: 'mt' + xstat.mtime.getTime(),
                                    ctime: 'ct' + xstat.ctime.getTime()
                                };
                                data.push(item);

                                if (recursive === true) {
                                    walk(folder + '/' + i, recursive);
                                }
                            }
                        }

                    } catch (err) {
                        LOG('RDIRSYNC NOT READABLE', insert, err);
                        walk(folder + '/' + i, recursive);
                    }
                } else {
                    LOG('RDIRSYNC NOT EXISTS', insert);
                    walk(folder + '/' + i, recursive);
                }
            });
        } else {
            LOG('RDIRSYNC NOT EXISTS ', folder);
        }
    };

    walk(folder, recursive);
    return data;
};

global.RDIRSYNCNESTED = function (folder, recursive, includes, withDirs, nested) {
    let data = {
        childs : []
    };
    let depth = 0;

    const walk = (folder, recursive, target) => {
        if (fs.existsSync(folder)) {
            const dir = fs.readdirSync(folder);

            dir.forEach(i => {
                let insert = folder + '/' + i;
                if (fs.existsSync(insert)) {
                    try {
                        const xstat = fs.statSync(insert);
                        let item = false;

                        // the files
                        if (!xstat.isDirectory() && withDirs !== 'only') {
                            let filename = path.basename(insert).replace(path.extname(insert), '');
                            let extension = path.extname(insert).replace('.', '');

                            if (includes.includes(extension)) {
                                item = {
                                    id: filename,
                                    filePath: insert,
                                    fileName: filename,
                                    extension: extension,
                                    size: xstat.size,
                                    atime: 'at' + xstat.atime.getTime(),
                                    mtime: 'mt' + xstat.mtime.getTime(),
                                    ctime: 'ct' + xstat.ctime.getTime()
                                }

                                target.push(item);
                            }
                        }

                        // the directories
                        if (xstat.isDirectory()) {
                            if (withDirs === true || withDirs === 'only') {
                                let folderName = path.basename(insert);
                                item = {
                                    id: folderName,
                                    path: insert,
                                    folderName: folderName,
                                    atime: 'at' + xstat.atime.getTime(),
                                    mtime: 'mt' + xstat.mtime.getTime(),
                                    ctime: 'ct' + xstat.ctime.getTime(),
                                };

                                target.push(item);
                                let nextTarget = target;

                                if (nested === true) {
                                    item.childs = [];
                                    nextTarget = item.childs;
                                }

                                if (recursive === true) {
                                    walk(folder + '/' + i, recursive, nextTarget);
                                }
                            }
                        }

                    } catch (err) {
                        LOG('RDIRSYNC NOT READABLE', insert, err);
                        walk(folder + '/' + i, recursive, target);
                    }
                } else {
                    LOG('RDIRSYNC NOT EXISTS', insert);
                    walk(folder + '/' + i, recursive, target);
                }
            });
        } else {
            LOG('RDIRSYNC NOT EXISTS ', folder, target);
        }
    };

    walk(folder, recursive, data.childs);
    return data;
};


global.FOLDERSYNC = function (folder) {
    if (fs.existsSync(folder)) {
        const dir = fs.readdirSync(folder);
        return dir;
    }
};