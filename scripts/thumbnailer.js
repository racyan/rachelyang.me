let cheerio = require('cheerio');
let debug   = require('debug')('thumbnailer');
let fs      = require('fs-extra');
let path    = require('path');
let sharp   = require('sharp');

function build(files, metalsmith, done) {
    buildAsync(files, metalsmith)
        .then(done)
        .catch(err => console.error(err));
}

async function buildAsync(files, metalsmith) {
    let fileNames = Object.keys(files);
    for (let i in Object.keys(files)) {
        let fileName = fileNames[i];
        await processFile(files, metalsmith, fileName);
    }
}

async function processFile(files, metalsmith, fileName) {
    if (path.extname(fileName) !== '.html') {
        return;
    }

    let file = files[fileName];
    let $ = cheerio.load(file.contents.toString());
    let images = $('img').get().map(img => $(img));

    for (let i in images) {
        await processImage(metalsmith, fileName, images[i]);
    }

    file.contents = new Buffer($.html());
}

async function processImage(metalsmith, fileName, imgElement) {
    let resizeSpec = imgElement.attr('thumbnail');
    imgElement.removeAttr('thumbnail');
    if (!resizeSpec) {
        return;
    }

    let newHeight, newWidth;
    let parts = resizeSpec.split('=');
    if (parts.length < 2) {
        throw new Error(`Invalid thumbnail spec "${resizeSpec}" in file "${fileName}"`);
    }

    let dimension = parts[0];
    let size = parts[1];
    if (dimension !== 'height' && dimension !== 'width') {
        throw new Error(`Invalid dimension "${dimension}" in file "${fileName}"`);
    }

    let sizeInt = parseInt(size, 10);
    if (!sizeInt) {
        throw new Error(`Invalid size "${size}" in file "${fileName}"`);
    }

    switch (dimension) {
        case 'height':
            newHeight = sizeInt;
            newWidth = null;
            break;
        case 'width':
            newHeight = null;
            newWidth = sizeInt;
            break;
    }

    let imgSrc = imgElement.attr('src');

    if (imgSrc.startsWith('/')) {
        imgSrc = imgSrc.substr(1);
    }

    let src = path.resolve(metalsmith.source(), imgSrc);
    let img = sharp(src).resize(newHeight, newWidth);
    let writtenInfo = await img.toBuffer({resolveWithObject: true});

    let folderPath = path.dirname(imgSrc);
    let extension = path.extname(imgSrc);
    let imgFileName = path.basename(imgSrc, extension);
    let outDimensions = `${writtenInfo.info.height}x${writtenInfo.info.width}`;
    let newRelativePath = `${folderPath}/${imgFileName}_${outDimensions}${extension}`;
    imgElement.attr('src', `/${newRelativePath}`);

    let newAbsolutePath = path.resolve(metalsmith.destination(), newRelativePath);
    try {
        let stats = fs.statSync(newAbsolutePath);
        if (stats.isFile()) {
            return;
        }
    } catch (e) {}

    debug(`Resized ${src} to ${outDimensions}`);

    let newFolder = path.dirname(newAbsolutePath);
    await fs.ensureDir(newFolder);
    await fs.writeFile(newAbsolutePath, writtenInfo.data);
}

module.exports = function thumnailer() {
    return build;
}
