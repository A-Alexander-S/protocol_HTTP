const path = require('path')
const fs = require('fs')
const http = require("http");
const url = require('url');

const host = 'localhost';
const port = 8000;

const user = {
  id: 123,
  username: 'testuser',
  password: 'qwerty'
};

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
    // Удаление файла
  } else if (url.parse(req.url, true).pathname === '/delete' && req.method === 'DELETE') {


    if (req.rawHeaders[13].split(';')[0].slice(11) == 'true' && req.rawHeaders[13].split(';')[5].slice(8) == user.id) {
      res.writeHead(200);

      let filename = url.parse(req.url, true).query.filename
      let pathFile = path.resolve(__dirname, './files');

      fs.unlink(`${pathFile}/${filename}.txt`, (err) => {
        if (err) throw err;
        res.end("success DELETE")
      });
    } else {
      res.end("Вы не авторизованы")
    }
  }

  // Авторизация
  else if (url.parse(req.url, true).pathname === '/auth' && req.method === 'POST') {

    // Высылаем куки если введены правильно логин и пароль
    if (url.parse(req.url, true).query.username === user.username && url.parse(req.url, true).query.password === user.password) {
      res.writeHead(200, {
        'Set-Cookie': [
          "userId=123",
          "authorized=true",
          "expires=Thu, 05 Aug 2022 18:45:00 -0000",
          "max_age=172800",
          "domain=localhost",
          "path=/auth"]
      });
      // console.log(req.rawHeaders[13].split(';')[0].slice(11));
      // console.log(req.rawHeaders[13].split(';')[5].slice(8));
      res.end("Всё верно");
    } else {
      res.writeHead(400);
      res.end("Неверный логин или пароль");
    }
  }

  else if (url.parse(req.url, true).pathname === '/post' && req.method === 'POST') {

    if (req.rawHeaders[13].split(';')[0].slice(11) == 'true' && req.rawHeaders[13].split(';')[5].slice(8) == user.id) {
      //Запрос на создание файла
      //http://localhost:8000/post?filename=Саша&content=ура
      let filename = url.parse(req.url, true).query.filename
      let content = url.parse(req.url, true).query.content
      let pathFile = path.resolve(__dirname, './files');

      fs.writeFile(`${pathFile}/${filename}.txt`, content, (err) => {
        if (err) throw err;
      });
      res.writeHead(200);
      res.end("success POST")
    } else {
      res.end("Вы не авторизовались");
    }
  }
  else if (req.url === '/redirect' && req.method === 'GET') {
    res.writeHead(301, { 'Location': '/redirected' });
    res.end("ресурс теперь постоянно доступен по адресу /redirected.")
  }
  else if (req.url === '/redirected' && req.method === 'GET') {
    res.writeHead(200);
    res.end("successfully redirected");
  }
  else {
    res.writeHead(405);
    res.end(`HTTP method not allowed`)
  }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});