const { $ } = global;
const { taskPath: path } = global;

const gulp = require('gulp');
const del = require('del');

const gulpWatch = gulp.watch;

gulp.task('clean:font', () => {
  'use strict';

  return del(path.build.font);
});

gulp.task('build:font', () => {
  'use strict';

  return gulp
    .src(path.src.font)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.newer(path.build.font))
    .pipe(gulp.dest(path.build.font));
});

gulp.task('dev:font', gulp.series('build:font'));

gulp.task('watch:font', () => {
  'use strict';

  return gulpWatch(path.watch.font, gulp.series('dev:font', 'server:reload'));
});
