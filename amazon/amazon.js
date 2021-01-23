const API = require('./api/api.js');
const Automator = require('./automator/automator.js');

const fs = require('fs');
const HEADERS_FILENAME = 'headers.json';

module.exports = class Amazon {
    constructor(isDebug) {
        this.didInitialization = false;
        this.isDebug = isDebug;
        this.headers = loadHeadersFromFile(); // may not need headers saved
        this.automator = new Automator(isDebug);
        if (this.headers != null) {
            this.api = new API(this.headers, isDebug);
        }
    }

    async init() {
        await this.automator.init();
        this.api = new API(this.automator.getHeaders());
        this.didInitialization = true;
    }

    findAllPhotosWithFilename(filename) {
        this.api.findAllPhotosWithFilename(filename, (placeholder) => console.log(placeholder));
    };

    async uploadPhotos(...photopaths) {
        if (!this.didInitialization) {
            await this.init();
        }
        await this.automator.uploadPhotos(photopaths);
    }

    async downloadPhotos(...photonames) {
        if (!this.didInitialization) {
            await this.init();
        }
        await this.api.downloadPhotosWithPhotonames(photonames);
    }

    async resetMetadata(progressCallback) {
        await downloadNewPhotoMetadata(progressCallback);
    }

}

// TODO: either move this to auth or pull the header write to fs code out of auth to here
const loadHeadersFromFile = () => {
    if (fs.existsSync('./' + HEADERS_FILENAME)) {
      return JSON.parse(fs.readFileSync('./' + HEADERS_FILENAME, { encoding: 'utf8'} ));
    }
}