const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('server:init', () => {
  'use strict';

  browserSync.init({
    rewriteRules: [
      {
        match: /Content-Security-Policy/,
        fn() {
          return 'DISABLED-Content-Security-Policy';
        },
      },
    ],
    port: 8080,
    server: { baseDir: './' },
    reloadDelay: 75,
  });
});

gulp.task('server:reload', (done) => {
  'use strict';

  browserSync.reload();
  done();
});
