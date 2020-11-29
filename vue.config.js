// const path = require("path");

// const resolve = dir => path.join(__dirname, dir);

module.exports = {
  devServer: {
    proxy: {
      "/face": { target: "http://172.16.28.122:8080/" },
    }
  },
};
