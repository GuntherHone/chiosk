const express = require("express");
const router = express.Router();
const { ipcMain } = require("electron");

function sendOK(res) {
  res.send(JSON.stringify({ status: "ok" }));
}

router.get("/getAllAssets", (req, res) => {
  console.log("API: getAllAssets");
  let assetManager = req.app.get("assetManager");
  let display = req.app.get("display");
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
  let display = req.app.get("display");
  display.send("pause");
  sendOK(res);
});

router.post("/play", (req, res) => {
  console.log("API: play");
  let display = req.app.get("display");
  display.send("play");
  sendOK(res);
});

router.post("/next", (req, res) => {
  console.log("API: next");
  let display = req.app.get("display");
  display.send("next");
  sendOK(res);
});

router.post("/previous", (req, res) => {
  console.log("API: previous");
  let display = req.app.get("display");
  display.send("previous");
  sendOK(res);
});

router.get("/getDisplayState", (req, res) => {
  console.log("API: getDisplayState");
  let display = req.app.get("display");
  display.send("getDisplayState");
  ipcMain.once("getDisplayState-reply", (event, { state, index }) => {
    console.log(`-> getDisplayState: state:${state} index:${index}`);
    res.send(JSON.stringify(state));
  });
});

router.post("/delete/:id?", (req, res) => {
  console.log(`API: delete ${req.params.id}`);

  const assetManager = req.app.get("assetManager");
  assetManager.delete(req.params.id);

  const display = req.app.get("display");
  display.send("delete_asset", req.params.id);

  sendOK(res);
});

router.post("/create", (req, res) => {
  console.log(`API: create ${JSON.stringify(req.body)}`);

  const assetManager = req.app.get("assetManager");
  let newAsset = assetManager.create(req.body);

  const display = req.app.get("display");
  display.send("new_asset", newAsset);

  sendOK(res);
});

module.exports = router;
