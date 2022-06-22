const path = require("path");
const nodeExternals = require("webpack-node-externals");
require("dotenv").config();
const CURRENT_WORKING_DIR = process.cwd();

module.exports = {
  name: "server",
  target: "node",
  context: path.resolve(CURRENT_WORKING_DIR, "src"),
  entry: {
    server: "./index.js",
  },
  mode: "development",
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\{.(js|html|css)}$/,
        exclude: [/(node_modules)/],
        loader: "babel-loader",
        options: {
          configFile: path.resolve(CURRENT_WORKING_DIR, ".babelrc"),
        },
      },
    ],
  },
  output: {
    path: path.resolve(CURRENT_WORKING_DIR, "dist"),
    filename: "[name].bundle.js",
    libraryTarget: "commonjs2",
  },
  devtool: "source-map",
};
