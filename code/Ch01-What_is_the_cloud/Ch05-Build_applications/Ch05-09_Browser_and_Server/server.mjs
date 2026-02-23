import http from 'http';
import fs from 'fs';
import path from 'path';

const basePath = "./code/Ch05-Build_applications/Ch05-09_Browser_and_Server/";

var gridWidth=10;
var gridHeight=10;

const cheeses = [
    {x:0,y:0},
    {x:1,y:1},
    {x:2,y:2}
];

function handlePageRequest(request, response) {

    console.log("Page request for:" + request.url);

    let filePath = basePath + request.url;

    let fileTypeDecode = {
        html: "text/HTML",
        css: "text/css",
        ico: "image/x-icon",
        mjs: "text/javascript",
        js: "text/javascript",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        tiff: "image/tiff"
    }

    if (fs.existsSync(filePath)) {
        // If it is a file - return it 
        console.log("     found file OK");
        response.statusCode = 200;
        let extension = path.extname(filePath);
        extension = extension.slice(1);
        extension = extension.toLowerCase();
        let contentType = fileTypeDecode[extension];
        if (contentType == undefined) {
            console.log("     invalid content type")
            response.statusCode = 415;
            response.setHeader('Content-Type', 'text/plain');
            response.write("Unspported media type: " + extension);
            response.end();
        }
        else {
            response.setHeader('Content-Type', contentType);
            let readStream = fs.createReadStream(filePath);
            readStream.pipe(response);
        }
    }
    else {
        // If it is not a file it might be a command
        console.log("Might have a request");
        switch (request.url) {
            case '/getstart.json': // Checks if the browser requested the getstart.json endpoint
                response.statusCode = 200; // Sets http status to 200 to indicate a successful request
                response.setHeader('Content-Type', 'text/json'); // Tells the browser that the response data is JSON
                let answer = { width:gridWidth,height:gridHeight, noOfCheeses:cheeses.length}; // Creates an object with grid size and number of cheeses
                let json = JSON.stringify(answer); // Converts the JavaScript object into a JSON string for sending to the client
                console.log("     handled a getstart:" + json); // Logs the JSON response to the server console for debugging
                response.write(json); // sends the JSON data back to the browser as the response body
                response.end(); // ends the response so the browser knows the data transfer is complete
                break; // Stops further switch-case execution after handling this request

            default:
                console.log("     file not found")
                response.statusCode = 404;
                response.setHeader('Content-Type', 'text/plain');
                response.write("Cant find file at: " + filePath);
                response.end();
        }
    }
}

let server = http.createServer(handlePageRequest);

console.log("Server running");

server.listen(3000);
