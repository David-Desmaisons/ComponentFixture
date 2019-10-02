const { globalVars } = require("./src/styles/globals");

module.exports = {
  baseUrl: "./",
  chainWebpack: config => {
    config.devtool("eval-source-map");
  },
  css: {
    loaderOptions: {
      less: {
        globalVars
      }
    }
  }
};
