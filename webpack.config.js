//@ts-check

'use strict';

const path = require('path');
const webpack = require("webpack");

const babelCommonRules = {
  loader: "babel-loader",
  options: {
    presets: ["@babel/preset-env", "@babel/preset-react"],
  },
};

const tsLoader = {
  loader: "ts-loader",
  options: {
    transpileOnly: true,
  },
};

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node',
  mode: 'none',

  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        use: [tsLoader],
        exclude: path.resolve(__dirname, "node_modules")
      }
    ]
  },
  devtool: 'source-map',
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
};

const mainWebViewConfig = {
  mode: "development",
  entry: "./webview/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new webpack.ProvidePlugin({ Buffer: ["buffer", "Buffer"] }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    fallback: {
      "path": require.resolve("path-browserify"),
      "process/browser": require.resolve("process/browser"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [tsLoader],
      },
      {
        test: /\.(png|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[hash]-[name][ext]",
        },
      },
      {
        test: /\.(js)$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: babelCommonRules,
      },
    ],
  },
};

module.exports = [extensionConfig, mainWebViewConfig];