const express = require("express");
const router = express.Router();
const { ipcMain } = require("electron");
const fs = require("fs");

function sendOK(res) {
  res.send(JSON.stringify({ status: "ok" }));
}

function getControlsFromApp(req) {
  let assetManager = req.app.get("assetManager");
  let display = req.app.get("display");
  return [assetManager, display];
}

router.get("/getAllAssets", (req, res) => {
  console.log("API: getAllAssets");
  const [assetManager, display] = getControlsFromApp(req);

  display.send("getDisplayState");
  ipcMain.once("getDisplayState-reply", (event, { state, index }) => {
    console.log(`-> getDisplayState:: state:${state} index:${index}`);
    res.send(
      JSON.stringify({
        status: "ok",
        assets: assetManager.read(),
        displayState: state
      })
    );
  });
});

router.post("/pause", (req, res) => {
  console.log("API: pause");
  const [assetManager, display] = getControlsFromApp(req);

  display.send("pause");
  sendOK(res);
});

router.post("/play", (req, res) => {
  console.log("API: play");
  const [assetManager, display] = getControlsFromApp(req);

  display.send("play");
  sendOK(res);
});

router.post("/next", (req, res) => {
  console.log("API: next");
  const [assetManager, display] = getControlsFromApp(req);

  display.send("next");
  sendOK(res);
});

router.post("/previous", (req, res) => {
  console.log("API: previous");
  const [assetManager, display] = getControlsFromApp(req);

  display.send("previous");
  sendOK(res);
});

router.get("/getDisplayState", (req, res) => {
  console.log("API: getDisplayState");
  const [assetManager, display] = getControlsFromApp(req);

  display.send("getDisplayState");
  ipcMain.once("getDisplayState-reply", (event, { state, index }) => {
    console.log(`-> getDisplayState: state:${state} index:${index}`);
    res.send(JSON.stringify(state));
  });
});

router.post("/delete/:id?", (req, res) => {
  console.log(`API: delete ${req.params.id}`);
  const [assetManager, display] = getControlsFromApp(req);

  assetManager.delete(req.params.id);
  display.send("delete_asset", req.params.id);

  sendOK(res);
});

router.post("/create", (req, res) => {
  console.log(`API: create ${JSON.stringify(req.body)}`);
  const [assetManager, display] = getControlsFromApp(req);

  let newAsset = assetManager.create(req.body);
  display.send("new_asset", newAsset);

  sendOK(res);
});

router.post("/update/:id?", (req, res) => {
  console.log(`API: update ${req.params.id}`);
  const [assetManager, display] = getControlsFromApp(req);

  assetManager.update(req.params.id, req.body);
  display.send("update_asset", req.body);

  sendOK(res);
});

router.post("/reorder", (req, res) => {
  const { source, destination } = req.body;
  console.log(`API: reorder source = ${source} destination = ${destination}`);
  const [assetManager, display] = getControlsFromApp(req);
  assetManager.reorder(source, destination);
  display.send("reorder_asset", req.body);

  sendOK(res);
});

router.post("/toggledevtools", (req, res) => {
  console.log(`API: toggledevtools`);
  const [assetManager, display] = getControlsFromApp(req);
  display.openDevTools();

  sendOK(res);
});

router.post("/uploadFile/:filename?", (req, res) => {
  console.log(`API: uploadFile ${req.params.filename}`);
  const [assetManager, display] = getControlsFromApp(req);

  const filename =
    assetManager.getId() + req.params.filename.match(/.[0-9a-z]+$/i)[0];

  req
    .pipe(fs.createWriteStream(`./upload/${filename}`))
    .on("close", () =>
      res.send(
        JSON.stringify({
          status: "ok",
          filename,
          originalFilename: req.params.filename
        })
      )
    );
});

module.exports = router;
