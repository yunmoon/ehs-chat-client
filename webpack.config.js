module.exports = {
  mode: "production",
  entry: [
    "babel-polyfill",
    "./lib/index.js"
  ],
  output: {
    library: 'ehsChatClient',
    libraryTarget: 'umd',
    path: __dirname + '/dist/',
    publicPath: "/dist/",
    filename: 'ehsChat.client.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  }
};
