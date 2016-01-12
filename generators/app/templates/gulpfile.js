var gulp = require('gulp');
var gbundle = require('gulp-bundle-assets');
var path = require('path');

gulp.task('bundle', function () {
    return gulp.src('./bundle.config.js')
        .pipe(gbundle())
        .pipe(gbundle.results('./'))
        .pipe(gulp.dest('./public'));
});

gulp.task('default', ['bundle']);

gulp.task('browser-sync', ['bundle'], function() {
    var browserSync = require('browser-sync').create();
    browserSync.init({
        proxy: "localhost:8088",
        reloadDelay: 5000
    });
    gbundle.watch({
        configPath: path.join(__dirname, 'bundle.config.js'),
        dest: path.join(__dirname, 'public')
    });
    gulp.watch(['css/**/*.css', 'app/**/*.js', 'views/tags/*.tag'], ['bundle']).on('change', browserSync.reload);
});