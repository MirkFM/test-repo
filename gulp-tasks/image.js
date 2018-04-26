const { $ } = global;
const { taskPath: path } = global;

const gulp = require('gulp');
const del = require('del');
const pngquant = require('imagemin-pngquant');

const gulpWatch = gulp.watch;

gulp.task('clean:image', () => {
  'use strict';

  return del(path.build.image);
});

gulp.task('build:image', () => {
  'use strict';

  return gulp
    .src(path.src.image)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.cached('images'))
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true,
    }))
    .pipe(gulp.dest(path.build.image))
    .pipe($.remember('images'))
    .pipe($.compass_imagehelper({
      targetFile: '_imagehelper.scss',
      template: './gulp-tasks/scss-imagehelper.mustache',
      images_path: path.build.image,
      css_path: path.build.style,
    }))
    .pipe(gulp.dest(path.build.compassHelper));
});

gulp.task('dev:image', gulp.series('build:image'));

gulp.task('watch:image', () => {
  'use strict';

  return gulpWatch(path.watch.image, gulp.series('dev:image', 'server:reload'));
});
