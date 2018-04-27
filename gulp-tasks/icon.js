const { $ } = global;
const { taskPath: path } = global;

const gulp = require('gulp');
const del = require('del');

const gulpWatch = gulp.watch;

gulp.task('clean:icon', () => del(path.build.icon));

gulp.task('build:icon', () =>
  gulp
    .src(path.src.icon)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.iconfont({
      fontName: path.build.iconFontName,
      formats: ['woff', 'woff2', 'svg'],
      normalize: true,
      fontHeight: 1001,
    }))
    .on('glyphs', (glyphs) => {
      const icons = [];
      const hexSystem = 16;

      for (let i = 0; i < glyphs.length; i += 1) {
        const glyph = glyphs[i];
        const item = {
          name: glyph.name,
          icon: glyph.unicode[0].charCodeAt(0).toString(hexSystem),
        };
        icons.push(item);
      }

      gulp
        .src('./gulp-tasks/_icons.mustache')
        .pipe($.mustache({
          icons,
          'font-name': path.build.iconFontName,
        }))
        .pipe($.ext_replace('.scss'))
        .pipe(gulp.dest(path.build.iconHelper));
    })
    .pipe(gulp.dest(path.build.icon)));

gulp.task('dev:icon', gulp.series('build:icon'));

gulp.task('watch:icon', () => gulpWatch(path.watch.icon, gulp.series('dev:icon', 'server:reload')));
