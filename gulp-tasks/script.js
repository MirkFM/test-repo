const { $ } = global;
const { taskPath: path } = global;

const gulp = require('gulp');
const del = require('del');
const filePath = require('path');
const tsify = require('tsify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const gulpWatch = gulp.watch;

gulp.task('clean:script', () => {
  'use strict';

  return del(path.build.script);
});

gulp.task('build:script', () => {
  'use strict';

  return gulp
    .src(path.src.script)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.data((file) => {
      const fileFullName = file.path;
      const fileNameForSave = `${filePath.basename(fileFullName, '.ts')}.js`;

      return browserify()
        .add(fileFullName)
        .plugin(tsify)
        .bundle()
        .pipe(source(fileNameForSave))
        .pipe(buffer())
        .pipe(gulp.dest(path.build.script));
    }));
});

gulp.task('dev:script', () => {
  'use strict';

  return gulp
    .src(path.src.script)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.data((file) => {
      const fileFullName = file.path;
      const fileNameForSave = `${filePath.basename(fileFullName, '.ts')}.js`;

      return browserify()
        .add(fileFullName)
        .plugin(tsify)
        .bundle()
        .pipe(source(fileNameForSave))
        .pipe(buffer())
        .pipe(gulp.dest(path.build.script));
    }));
});

gulp.task('watch:script', () => {
  'use strict';

  return gulpWatch(path.watch.script, gulp.series('dev:script', 'server:reload'));
});
