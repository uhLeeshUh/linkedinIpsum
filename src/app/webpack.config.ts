import HtmlWebPackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: "./src/app/index.tsx",
  output: {
    path: path.join(__dirname, "..", "..", "public"), // path in project for server to find and send compiled static files
    publicPath: "/", // used by HtmlWebPackPlugin to prepend bundle.js with an absolute path in browser
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
      {
        exclude: /node_modules/,
        test: /\.(graphql|gql)$/,
        loader: "graphql-tag/loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".graphql", ".gql"],
  },
  devtool: isProduction ? false : "inline-source-map", // maps compiled code back to original source code
  devServer: {
    port: PORT,
    publicPath: "/", // webpack dev server will output its compiled files here, which matches the absolute output.publicPath above
    historyApiFallback: true, //  https://stackoverflow.com/questions/26203725/how-to-allow-for-webpack-dev-server-to-allow-entry-points-from-react-router
    proxy: {
      "/graphql": "http://localhost:8080", // proxy graphql requests to dev backend server
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: "./src/server/index.html",
      filename: "./index.html",
    }),
  ],
};
