var path = require("path");
module.exports = {
  entry: {
        home: "./home.coffee",
        login: "./login.coffee",
        welcome: "./components_sys/welcome/index.coffee",
        business_management: "./components_sys/business_management/index.coffee",
        user_management: "./components_sys/user_management/index.coffee",
        api_management: "./components_sys/api_management/index.coffee",
        role_management: "./components_sys/role_management/index.coffee"
    },
  output: {
        path: path.join(__dirname, "build"),
        filename: "[name].js",
        chunkFilename: "[id].chunk.js"
    },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.vue$/, loader: "vue-loader" },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.(html|tpl)$/, loader: "html?attrs=img:requir-src" },
      { test: /\.css$/, loader: "style!css" },
    ]
  },
  resolve: {
    extensions: ["", ".web.coffee", ".web.js", ".coffee", ".js"]
  }
}
