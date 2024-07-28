const express = require("express");
const http = require("http");
const io = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const routes = require("./server/routes");
const config = require("./server/config.js");

class Server {
  constructor() {
    this.app = express();
    this.httpServer8080 = http.createServer(this.app);
    this.socket8080 = io(this.httpServer8080);

    this.httpServer443 = http.createServer(this.app);
    this.socket443 = io(this.httpServer443);
  }

  appconfig() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(express.static(path.join(__dirname, "build")));
    new config(this.app);
  }

  includeRoutes() {
    new routes(this.app, this.socket8080).routesConfig();
    new routes(this.app, this.socket443).routesConfig();
  }

  start() {
    this.appconfig();
    this.includeRoutes();

    this.httpServer8080.listen(8080, () => {
      console.log("Server started on port 8080");
    });

    this.httpServer443.listen(443, () => {
      console.log("Server started on port 443");
    });
  }
}

const server = new Server();
server.start();
