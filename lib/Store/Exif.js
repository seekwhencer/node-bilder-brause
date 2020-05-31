import exif from 'exif';

const ExifImage = exif.ExifImage;

export default class Exif extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.propsMap = {
            "Make": "Make",
            "Model": "Model",
            "DateTimeOriginal": "Time",
            "ApertureValue": "aperture",
            "FocalLength": "focalLength",
            "ISOSpeedRatings": "ISO",
            "ExposureTime": "Shutter Speed",
            "GPSLatitude": "Lat",
            "GPSLongitude": "Long",
            "ImageDescription": "Description",
        };

        this.exifMap = {};

    }

    read(staticPath) {
        return new Promise((resolve, reject) => {
            try {
                new ExifImage({
                    image: staticPath
                }, (error, data) => {

                    if (error) {
                        resolve(this.exifMap);
                    } else {
                        const properties = {
                            ...data.image,
                            ...data.exif,
                            ...data.gps
                        };

                        // to see what is available, uncomment this
                        //this.exifMap.possibleFields = Object.keys(properties);

                        const propertyKeys = Object.keys(this.propsMap);
                        Object.keys(properties).forEach(propKey => {
                            if (propertyKeys.includes(propKey)) {
                                this.exifMap[propKey] = properties[propKey];
                            }
                        });

                        resolve(this.exifMap);
                    }
                });
            } catch (error) {
                resolve(this.exifMap);
            }
        });
    }
}

function dec2frac(d) {
    let df = 1, top = 1, bot = 1;

    while (df !== d) {
        if (df < d) {
            top += 1;
        } else {
            bot += 1;
            top = parseInt(d * bot);
        }
        df = top / bot;
    }
    return top + '/' + bot;
}
