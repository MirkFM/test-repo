const srcPath = {
  locale: 'ru',
  lineending: '\r\n',
  data: './src/data/',
  font: './src/fonts/**/*.*',
  html: ['src/pug/*.pug', '!src/pug/_*.pug'],
  icon: './src/icons/*.svg',
  image: ['./src/img/**/*.*', '!src/img/images/**/*.*'],
  script: './src/ts/*.ts',
  style: './src/scss/*.scss',
  vendor: './src/vendor/**/*.*',
};

const buildPath = {
  compassHelper: './src/scss/helpers/',
  font: './build/fonts/',
  html: './',
  icon: './build/fonts-icon/iconFont',
  iconFontName: 'iconFont',
  iconHelper: './src/scss/helpers/',
  image: './build/img/',
  script: './build/js/',
  style: './build/css/',
  vendor: './build/vendor/',
};

let watchPath = {
  html: ['./src/pug/**/*.pug', './src/data/**/*.json'],
  style: './src/scss/**/*.scss',
};

// src path is default watch path
watchPath = Object.assign({}, srcPath, watchPath);

module.exports = { path: {
  build: buildPath,
  src: srcPath,
  watch: watchPath,
} };
