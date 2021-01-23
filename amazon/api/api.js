// const got = require('got');
const download = require('./download.js');
const Metadata = require('./metadata.js');

module.exports = class AmazonAPI {
    constructor(headers, isDebug) {
        this.headers = headers;
        this.isDebug = isDebug;
        this.metadata = new Metadata(headers, isDebug);
    }

    // TODO: include number of photos instead of guessing
    findAllPhotosWithFilename(filename, searchProgressCallback) {
        photonames = [];
        for (let i = 0; i < 10; i++) {
            photonames.push(filename + '-' + i + '.png');
        }
        photosFound = this.metadata.findMetaDataForFilenames(photonames, searchProgressCallback);
        return photosFound.map(photo => photo.name);
    }

    async downloadPhotoWithPhotoname(photoname, downloadProgressCallback) {
        await download.fetch(headers, photoname, fileId, ownderId, downloadProgressCallback);
    }

    async downloadPhotosWithPhotonames(photonames, downloadProgressCallback) {
        if (photonames.length == 0) {
            // todo: throw error?
        } else if (photonames.length == 1) {
            await this.downloadPhotoWithPhotoname(photonames[0], downloadProgressCallback);
        } else {
            await download.fetchBatch();
        }
    }

    async downloadNewPhotoMetadata(progressCallback) {
        await this.metadata.fetchAllFileMetaData(progressCallback);
    }
}
