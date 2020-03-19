import HtmlWebPackPlugin from "html-webpack-plugin";

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
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
