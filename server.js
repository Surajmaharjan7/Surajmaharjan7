const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = process.env.PORT || 3000;
const contentTypes = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript',
    '.png': 'image/png'
};

const server = http.createServer((request, response) => {
    const requestedPath = decodeURIComponent(request.url.split('?')[0]);
    const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.slice(1);
    const filePath = path.resolve(root, relativePath);

    if (!filePath.startsWith(root + path.sep)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    fs.stat(filePath, (error, stats) => {
        if (error || !stats.isFile()) {
            response.writeHead(404);
            response.end('Not found');
            return;
        }

        response.writeHead(200, {
            'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream'
        });
        fs.createReadStream(filePath).pipe(response);
    });
});

server.listen(port, () => {
    console.log(`Gallery running at http://localhost:${port}`);
});