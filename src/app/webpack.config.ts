import HtmlWebPackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import cssnano from "cssnano";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;
const getPlugins = (isProduction: boolean) => {
  const plugins: any[] = [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: "./src/server/index.html",
      filename: "./index.html",
    }),
  ];

  if (isProduction) {
    plugins.push(
      new OptimizeCssAssetsPlugin({
        cssProcessor: cssnano,
      }),
    );
  }

  return plugins;
};

const webpackConfig = {
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
            loader: "awesome-typescript-loader",
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
      {
        test: /\.css$/,
        use: [
          {
            loader: isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            options: {
              esModule: true,
            },
          },
          "css-modules-typescript-loader",
          {
            loader: "css-loader",
            options: {
              esModule: true,
              modules: {
                mode: "local",
                localIdentName: "[name]-[local]-[hash:base64]",
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".graphql", ".gql", ".css"],
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
  plugins: getPlugins(isProduction),
};

export default webpackConfig;
