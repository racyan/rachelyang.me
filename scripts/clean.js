let fs = require('fs-extra');

console.log('Removing build folder');
fs.removeSync('../build');
console.log('Project cleaned');
