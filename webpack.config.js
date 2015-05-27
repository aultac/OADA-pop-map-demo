module.exports = {
  entry: "./src/app/app.js",
  output: {
    filename: "build/bundle.js",
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'} // inline base64 URLs for <=8k images, direct URLs for the rest
    ],
  },

  externals: {
    'leaflet': 'L',
  },

  resolve: {
    extensions: ['', '.js', '.json', ],
  },
};

