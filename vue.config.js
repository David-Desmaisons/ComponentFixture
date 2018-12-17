module.exports = {
  baseUrl: "./",
  chainWebpack: config => {
    config.devtool("eval-source-map");
  }
};
