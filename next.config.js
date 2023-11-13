module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(pdf)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          publicPath: "/assets/",
          outputPath: "public/assets/",
        },
      },
    });

    return config;
  },
};
