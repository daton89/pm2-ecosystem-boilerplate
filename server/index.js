const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
var pmx = require('pmx');
const port = process.argv[2] || 8888;

pmx.init({
    network: true,      // Network monitoring at the application level
    ports: true,        // Shows which ports your app is listening on (default: false)
    http: true,         // routes logging enable pm2 to perform http watching for http related metrics
    errors: true,       // Exceptions logging
    custom_probes: true // Auto expose JS Loop Latency and HTTP req/s as custom metrics
});

const Probe = pmx.probe();

http.createServer(function (request, response) {

    var uri = url.parse(request.url).pathname
        , filename = path.join(process.cwd(), 'client', uri);

    var contentTypesByExtension = {
        '.html': "text/html",
        '.css': "text/css",
        '.js': "text/javascript"
    };

    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += 'index.html';

        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(err + "\n");
                response.end();
                return;
            }

            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");