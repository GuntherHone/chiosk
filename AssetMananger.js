const fs = require("fs");

module.exports = function AssetMananger(assetFile, autocreate = true) {
  this.assets = [];
  fs.readFile(assetFile, "utf-8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT" && autocreate) {
        fs.writeFile(assetFile, JSON.stringify(assets), err => {
          if (err) {
            throw err;
          }
        });
      } else {
        throw err;
      }
    } else {
      this.assets = JSON.parse(data);
    }
  });

  return {
    getAssets: () => this.assets
  };
};
