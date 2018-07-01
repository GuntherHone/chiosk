const express = require("express");
const router = express.Router();

let assets = [
  { _id: 0, description: "node", url: "https://nodejs.org" },
  { _id: 1, description: "google", url: "https://www.google.com" }
];

router.get("/getAllAssets", (req, res) => {
  res.send(assets);
});

module.exports = router;
