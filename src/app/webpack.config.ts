import HtmlWebPackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const outputDir = "dist";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: "./src/app/index.tsx",
  output: {
    path: path.join(__dirname, outputDir),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.m?tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader?module=es6",
          },
        ],
      },
      {
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  devtool: isProduction ? false : "inline-source-map", // maps compiled code back to original source code
  devServer: {
    port: 3000,
    historyApiFallback: true, // https://stackoverflow.com/questions/26203725/how-to-allow-for-webpack-dev-server-to-allow-entry-points-from-react-router
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: "./src/server/index.html",
      filename: "./index.html",
    }),
  ],
};
