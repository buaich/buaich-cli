// @ts-nocheck
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";
import type { Configuration } from "webpack";

const config: Configuration = {
  mode: "development",
  entry: path.join(__dirname, "src", "main.ts"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "assets/[name].[contenthash].js",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
    }),
  ],
  devServer: {
    port: 5173,
    hot: true,
    open: false,
    historyApiFallback: true,
  },
};

export = config;
