let cheerio = require('cheerio');
let debug   = require('debug')('thumbnailer');
let fs      = require('fs');
let jimp    = require('jimp');
let path    = require('path');

function build(files, metalsmith, done) {
    let filePromises = Object.keys(files).map(function (fileName) {
        return new Promise(function (resolve, reject) {
            processFile(resolve, reject, files, metalsmith, fileName);
        });
    });
    Promise.all(filePromises)
        .then(() => done())
        .catch(err => console.error('build error: ' + err));
}

function processFile(resolve, reject, files, metalsmith, fileName) {
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
            processImage(resolve, reject, metalsmith, fileName, image);
        });
    }).get();
    Promise.all(imagePromises)
        .then(function () {
            file.contents = new Buffer($.html());
            resolve();
        })
        .catch(err => console.error(err));
}

function processImage(resolve, reject, metalsmith, fileName, imgElement) {
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

    let imgSrc = imgElement.attr('src');

    if (imgSrc.startsWith('/')) {
        imgSrc = imgSrc.substr(1);
    }

    let src = path.resolve(metalsmith.source(), imgSrc);
    jimp.read(src, function (err, img) {
        if (err) {
            resolve();
            return;
        }

        img.resize(newHeight, newWidth);

        let folderPath = path.dirname(imgSrc);
        let extension = path.extname(imgSrc);
        let imgFileName = path.basename(imgSrc, extension);
        let outDimensions = `${img.bitmap.height}x${img.bitmap.width}`;
        let newRelativePath = `${folderPath}/${imgFileName}_${outDimensions}${extension}`;
        imgElement.attr('src', `/${newRelativePath}`);

        let newAbsolutePath = path.resolve(metalsmith.destination(), newRelativePath);
        try {
            let stats = fs.statSync(newAbsolutePath);
            if (stats.isFile()) {
                resolve();
                return;
            }
        } catch (e) {}

        debug(`Resized ${src} to ${outDimensions}`);

        img.write(newAbsolutePath, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

module.exports = function thumnailer() {
    return build;
}
