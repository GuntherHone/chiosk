const express = require("express");
const router = express.Router();
const { ipcMain } = require("electron");

router.get("/getAllAssets", (req, res) => {
  let assetManager = req.app.get("assetManager");
  res.send(assetManager.getAssets());
});

router.post("/pause", (req, res) => {
  console.log("API: pause");
  let display = req.app.get("display");
  display.send("pause");
  res.send(JSON.stringify({status:"ok"}));
});

router.post("/play", (req, res) => {
  console.log("API: play");
  let display = req.app.get("display");
  display.send("play");
  res.send(JSON.stringify({status:"ok"}));
});

router.post("/next", (req, res) => {
  console.log("API: next");
  let display = req.app.get("display");
  display.send("next");
  res.send(JSON.stringify({status:"ok"}));
});

router.get("/getDisplayState", (req, res) => {
  console.log("API: getDisplayState");
  let display = req.app.get("display");
  display.send("getDisplayState");
  ipcMain.once("getDisplayState-reply", (event, state) => {
    console.log(`-> getDisplayState ${state}`);
    res.send(JSON.stringify(state));
  });
});

module.exports = router;
