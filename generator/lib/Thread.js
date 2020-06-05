import {workerData, parentPort} from 'worker_threads';
import fs from "fs-extra";
import ImageMagick from "imagemagick-stream";

try {
    // do things here then:
    /*setTimeout(() => {
        parentPort.postMessage({status: "complete"});
    }, 2000);*/

    fs.mkdirpSync(workerData.thumbnailPath);
    const read = fs.createReadStream(workerData.filePath);
    const write = fs.createWriteStream(workerData.thumbnail);

    write.on('finish', () => parentPort.postMessage('complete'));

    const resize = ImageMagick().resize(workerData.imagemagickSizeString).quality(workerData.quality);
    read.pipe(resize).pipe(write);


} catch (e) {
    console.log('>>> TRY ERROR', e);
}
