let frontmatter = require('metalsmith-matters');
let handlebars  = require('handlebars');
let Metalsmith  = require('metalsmith');
let layouts     = require('metalsmith-layouts');
let markdown    = require('metalsmith-markdown');
let permalinks  = require('metalsmith-permalinks');
let sass        = require('metalsmith-sass');
let start       = require('metalsmith-start');

handlebars.registerHelper('currentYear', function () {
    return (new Date()).getFullYear();
});

function denamespace(namespace, propertyNames) {
    return function _denamespace(files, metalsmith, done) {
        Object.keys(files).forEach(function(file) {
            let data = files[file];
            propertyNames.forEach(function(propertyName) {
                if (data[namespace] && data[namespace][propertyName]) {
                    data[propertyName] = data[namespace][propertyName];
                    delete data[namespace][propertyName];
                }
            });
        });
        done();
    }
}

let flag = process.argv[2] || '';
let serveMode = flag === '--serve';
if (flag === '-h' || flag == '--help') {
    console.log('Usage: node build.js [--help|--serve]');
    process.exit(1);
}

function log(message) {
    if (serveMode) {
        return (files, metalsmith, done) => done();
    }

    return function _log(files, metalsmith, done) {
        console.log(message);
        done();
    }
}

let ms = Metalsmith(__dirname)
    .metadata({
        site: {
            title: 'Rachel Yang'
        }
    })
    .frontmatter(false)
    .source('./src')
    .destination('./build')
    .clean(!serveMode)
    .use(log('Parsing frontmatter'))
    .use(frontmatter({
        namespace: 'page'
    }))
    .use(denamespace('page', ['layout']))
    .use(log('Compiling markdown'))
    .use(markdown())
    .use(log('Building permalinks'))
    .use(permalinks())
    .use(log('Applying layouts'))
    .use(layouts({
        engine: 'handlebars'
    }))
    .use(log('Complining sass'))
    .use(sass({
        includePaths: [__dirname + '/sass_includes']
    }))
    .use(log('Build completed'));

if (serveMode) {
    let runner = new start.Runner(ms);
    runner.start();
} else {
    ms.build(function(err, files) {
        if (err) { throw err; }
    });
}
