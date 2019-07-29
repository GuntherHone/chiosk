const os = require("os");

const interfaces = os.networkInterfaces();

module.exports = () =>
  Object.keys(interfaces).reduce((acc, ifname) => {
    let ifAddresses = interfaces[ifname].reduce((acc, alias) => {
      if (!alias.internal && alias.family === "IPv4") {
        return [...acc, alias.address];
      } else {
        return acc;
      }
    }, []);
    return [...acc, ...ifAddresses];
  }, []);
