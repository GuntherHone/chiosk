const fs = require("fs");
const uniqid = require("uniqid");

module.exports = function AssetMananger(assetFile, autocreate = true) {
  this.assets = [];
  fs.readFile(assetFile, "utf-8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT" && autocreate) {
        fs.writeFile(assetFile, JSON.stringify(this.assets), err => {
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

  function persistData() {
    fs.writeFileSync(assetFile, JSON.stringify(assets));
  }

  return {
    read: () => assets,

    create: ({ description, url, time_ms }) => {
      let newAsset = { _id: uniqid(), description, url, time_ms };
      assets.push(newAsset);
      persistData();
      return newAsset;
    },

    update: (id, asset) => {
      let index = assets.findIndex(item => item._id === id);

      if (index >= 0) {
        assets[index] = { ...assets[index], ...asset };
      }

      persistData();

      return assets[index];
    },

    delete: id => {
      let index = assets.findIndex(item => item._id === id);

      if (index >= 0) {
        assets.splice(index, 1);
        persistData();
      }
    },

    reorder: (source, destination) => {
      let [asset] = assets.splice(source, 1);
      assets.splice(destination, 0, asset);
      persistData();
    },

    getId: _ => uniqid()
  };
};
