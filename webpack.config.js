const { spawn } = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const MODE = process.env.NODE_ENV;
const configMain = {
  mode: MODE,
  entry: "./src/main/main.js",
  target: "electron-main",
  output: {
    filename: "bundle-main.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" }
      }
    ]
  },
  plugins: [new webpack.ContextReplacementPlugin(/bindings$/, /^$/)],
  // externals: ["bindings"],
  externals: {
    // bindings: "require('bindings')",
    ffi: "require('ffi')",
    ref: "require('ref')"
  },
  node: {
    __dirname: false
  },

  devServer: {
    contentBase: "./dist",
    hot: true,

    before() {
      spawn("electron", ["."], {
        shell: true,
        env: process.env,
        stdio: "inherit"
      })
        .on("close", code => process.exit(0))
        .on("error", spawnError => console.error(spawnError));
    }
  }
};
const configRenderer = {
  mode: MODE,
  entry: "./src/renderer/renderer.js",
  target: "electron-renderer",
  output: {
    filename: "bundle-renderer.js"
  },
  node: {
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" }
      },
      {
        test: /\.css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: true }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {}
        }
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};

module.exports = [configMain, configRenderer];
