const path = require('path');
const distPath = path.resolve(__dirname, '../iceAdventure/js', 'Obfuscation');

module.exports = (env) => ({
  mode: env && env.production ? 'production' : 'development',
  entry: './js/Main.js',
  output: {
    filename: 'Main.js',
    path: path.resolve(distPath),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              comments: !(env && env.production),
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['last 2 versions'],
                    },
                  },
                ]
              ],
              plugins: (env && env.production) ? [
                ['transform-remove-console', { exclude: ["error", "warn"] }]
              ] : []
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: []
});
