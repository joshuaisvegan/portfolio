var http = require('http');
var fs = require('fs');
var path = require('path');
    path.dirname('');
try {
    var directories = fs.readdirSync('./projects');
} catch (e) {
    console.log(e);
}

var directories = fs.readdirSync('./projects');
var server = http.createServer(function(request, response) {
    var headers = request.headers;
    var method = request.method;
    var url = request.url;

    if (method !== 'GET'){
        response.statusCode = 404;
        console.log('Improper request');
        response.end();
        return;
      }
    var directoryName;
    var targetFile;
    console.log(url);
    var isProjectDirectory = directories.some(function(item) {
        if (url.startsWith('/projects/' + item)) {
            directoryName = __dirname + "/projects/" + item;
            targetFile = url.replace("/projects/" + item, "");
            console.log(item);
            return true;
        }
    });
    if (isProjectDirectory){
        console.log(9);
        if (targetFile === '' || targetFile === "/"){
            targetFile = 'index.html';
        }
        console.log(targetFile, url, directoryName);
        fs.readdir(directoryName, function(err, items){
            if (err) {
                console.log(err);
                response.statusCode = 500;
                response.end();
                return;
            }
            if (items.indexOf(targetFile) == -1){
                response.statusCode = 404;
                response.end();
                return;
            }
            response.statusCode = 200;
            if (targetFile.slice(-5) == '.html'){
                response.setHeader('Content-Type', 'text/html');
            }
            if (targetFile.slice(-4) == '.css'){
                response.setHeader('Content-Type', 'text/css');
            }
            if (targetFile.slice(-3) == '.js'){
                response.setHeader('Content-Type', 'text/javascript');
            }
            if (targetFile.slice(-5) == '.json'){
                response.setHeader('Content-Type', 'application/json');
            }
            console.log(targetFile);

            var stream = fs.createReadStream(directoryName + "/" + targetFile);
            stream.on('error', function(err){
                console.log(err);
            });
            stream.pipe(response);
        });
    }
}).listen(8080);
