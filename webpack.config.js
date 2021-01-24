const path = require('path');

module.exports = {
  mode: 'development',  // режим разработки
  entry: './src/main.js', // точка входа
  output: {
    filename: 'bundle.js', // файл сборки
    path: path.resolve(__dirname, 'public'), // директория для сборки
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    watchContentBase: true, // слежка, чтобы не обновлять страницу руками
    port: 3030,
  }
};