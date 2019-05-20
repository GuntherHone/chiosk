const { app, BrowserWindow } = require("electron");
const express = require("express");
const assetManager = require("./AssetMananger");

const server = express();
const assets = assetManager("./assets.json");

server.set("assetManager", assets);

server.use(express.json());
server.use("/api", require("./api"));
server.use("/", express.static("build"));

let window;

app.on("ready", () => {
  window = new BrowserWindow({ frame: false });
  window.webContents.openDevTools();
  window.loadFile("./display.html");

  window.webContents.on("dom-ready", () => {
    window.webContents.send("set_assets", assets.read());
    server.set("display", window.webContents);
    server.listen(3000, () => console.log("Listening on port 3000"));
  });
});
