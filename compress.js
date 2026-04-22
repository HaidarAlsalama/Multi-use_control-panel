// compress.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const compressGzip = (filePath) => {
    const fileContents = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(fileContents, { level: 9 });
    fs.writeFileSync(filePath + '.gz', gzipped);
};

const compressBrotli = (filePath) => {
    const fileContents = fs.readFileSync(filePath);
    const brotli = zlib.brotliCompressSync(fileContents, {
        params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        }
    });
    fs.writeFileSync(filePath + '.br', brotli);
};

const compressFolder = (folderPath) => {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.css')) {
            const fullPath = path.join(folderPath, file);
            compressGzip(fullPath);
            compressBrotli(fullPath);
            console.log(`Compressed ${file}`);
        }
    });
};

compressFolder('./build/static/js');
compressFolder('./build/static/css');
