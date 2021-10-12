const path = require('path')
const fs = require('fs')
const http = require("http");

const host = 'localhost';
const port = 8000;

const requestListener = (req, res) => {

  if (req.url === '/get' && req.method === 'GET') {

    fs.readdir(path.join(__dirname, "files"), "utf-8", (err, files) => {
      if (err) {
        res.writeHead(500);
        res.end("Internal server error")
        throw new Error(err)
      }

      res.writeHead(200);
      for (item of files) {
        res.write(item + " ");
      }
      res.end();
    })

  } else if (req.method === 'DELETE') {
    res.writeHead(200);
    res.end("success DELETE");
  } else if (req.method === 'POST') {
    res.writeHead(200);
    res.end("success POST")
  }
  else if (req.url === '/redirect' && req.method === 'GET') {
    res.writeHead(200);
    res.end("ресурс теперь постоянно доступен по адресу /redirected.")
  }
  else {
    res.writeHead(405);
    res.end("HTTP method not allowed")
  }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});