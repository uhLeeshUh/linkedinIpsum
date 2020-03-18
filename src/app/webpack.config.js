const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  entry: "./src/app/app.jsx",
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/server/index.html",
      filename: "./index.html",
    }),
  ],
};
