let cheerio = require('cheerio');
let debug   = require('debug')('thumbnailer');
let jimp    = require('jimp');
let path    = require('path');

function build(files, metalsmith, done) {
    let filePromises = Object.keys(files).map(function (fileName) {
        return new Promise(function (resolve, reject) {
            processFile(resolve, reject, files, fileName);
        });
    });
    Promise.all(filePromises)
        .then(() => done())
        .catch(err => console.error('build error: ' + err));
}

function processFile(resolve, reject, files, fileName) {
    if (path.extname(fileName) !== '.html') {
        resolve();
        return;
    }

    let file = files[fileName];
    let $ = cheerio.load(file.contents.toString());
    let images = $('img');
    let imagePromises = images.map(function () {
        let image = $(this);
        return new Promise(function (resolve, reject) {
            processImage(resolve, reject, files, fileName, image);
        });
    }).get();
    Promise.all(imagePromises)
        .then(function () {
            file.contents = new Buffer($.html());
            resolve();
        })
        .catch(err => console.error(err));
}

function processImage(resolve, reject, files, fileName, imgElement) {
    let src = imgElement.attr('src');

    if (src.startsWith('/')) {
        src = src.substr(1);
    }

    if (!(src in files)) {
        resolve();
        return;
    }

    let resizeSpec = imgElement.attr('thumbnail');
    imgElement.removeAttr('thumbnail');
    if (!resizeSpec) {
        resolve();
        return;
    }

    let newHeight, newWidth;
    let parts = resizeSpec.split('=');
    if (parts.length < 2) {
        reject(`Invalid thumbnail spec "${resizeSpec}" in file "${fileName}"`);
        return;
    }

    let dimension = parts[0];
    let size = parts[1];
    if (dimension !== 'height' && dimension !== 'width') {
        reject(`Invalid dimension "${dimension}" in file "${fileName}"`);
        return;
    }

    let sizeInt = parseInt(size, 10);
    if (!sizeInt) {
        reject(`Invalid size "${size}" in file "${fileName}"`);
        return;
    }

    switch (dimension) {
        case 'height':
            newHeight = sizeInt;
            newWidth = jimp.AUTO;
            break;
        case 'width':
            newHeight = jimp.AUTO;
            newWidth = sizeInt;
            break;
    }

    jimp.read(files[src].contents, function (err, img) {
        if (err) {
            reject(err);
        }

        img.resize(newHeight, newWidth);

        let folderPath = path.dirname(src);
        let extension = path.extname(src);
        let imgFileName = path.basename(src, extension);
        let outDimensions = `${img.bitmap.height}x${img.bitmap.width}`;
        let newPath = `${folderPath}/${imgFileName}_${outDimensions}${extension}`;
        imgElement.attr('src', `/${newPath}`);

        if (newPath in files) {
            resolve();
            return;
        }

        debug(`Resized ${src} to ${outDimensions}`);

        img.getBuffer(jimp.AUTO, function (err, buffer) {
            if (err) {
                reject(err);
            }

            files[newPath] = {
                contents: buffer,
                mode: '0644'
            };
            resolve();
        });
    });
}

module.exports = function thumnailer() {
    return build;
}
