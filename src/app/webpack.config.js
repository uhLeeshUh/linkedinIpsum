const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        exclude: /node_modules/,
        test: /\.m?tsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  entry: "./src/app/index.tsx",
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/server/index.html",
      filename: "./index.html",
    }),
  ],
};
