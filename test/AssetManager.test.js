const AssetManager = require("../AssetMananger.js");
const OUTPUT_FILE = "./assets.test.json";
const assets = AssetManager(OUTPUT_FILE);
const fs = require("fs");

assets.create({
  description: "Gogle",
  url: "https://www.google.com",
  time_ms: 10000
});

assets.create({
  description: "Texas Instruments",
  url: "https://www.ti.com",
  time_ms: 1000
});

assets.create({
  description: "Node",
  url: "https://noodejs.org",
  time_ms: 5000
});

let myAssets = assets.read();
console.log(myAssets);

assets.update(myAssets[0]._id, { description: "Google" });
assets.update(myAssets[2]._id, { url: "https://nodejs.org" });
assets.delete(myAssets[1]._id);

myAssets = assets.read();
console.log(myAssets);

fs.readFile(OUTPUT_FILE, (err, data) => {
  if (err) throw err;
  let fileData = JSON.parse(data);
  if (
    fileData.reduce(
      (prev, curr, index) =>
        prev &&
        curr._id === myAssets[index]._id &&
        curr.description === myAssets[index].description &&
        curr.url === myAssets[index].url &&
        curr.time_ms === myAssets[index].time_ms,
      true
    )
  ) {
    console.log("Test passed!");
  } else {
    console.log("Test failed!!");
  }
  fs.unlinkSync(OUTPUT_FILE);
});
