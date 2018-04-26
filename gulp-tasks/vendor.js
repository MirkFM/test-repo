const { $ } = global;
const { taskPath: path } = global;

const gulp = require('gulp');
const del = require('del');

const gulpWatch = gulp.watch;

gulp.task('clean:vendor', () => {
  'use strict';

  return del(path.build.vendor);
});

gulp.task('build:vendor', () => {
  'use strict';

  return gulp
    .src(path.src.vendor)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.newer(path.build.vendor))
    .pipe($.eol(path.src.lineending))
    .pipe($.insert.append(path.src.lineending))
    .pipe(gulp.dest(path.build.vendor));
});

gulp.task('dev:vendor', gulp.series('build:vendor'));

gulp.task('watch:vendor', () => {
  'use strict';

  return gulpWatch(path.watch.vendor, gulp.series('dev:vendor', 'server:reload'));
});
