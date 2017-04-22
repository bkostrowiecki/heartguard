var gulp = require('gulp'),
    livereload = require('gulp-livereload');
 
gulp.task('livereload', function () {
  gulp.src(['/', '']).pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('bin/game.js', ['livereload']);
});