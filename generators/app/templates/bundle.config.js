var lazypipe = require('lazypipe');
var riot = require('gulp-riot');
var gulp = require('gulp');
var riottransform = lazypipe().pipe(riot).pipe(gulp.dest, './public');

module.exports = {
    bundle: {
        main: {
            styles: [
                './css/vendor/*.css', //load vendor css first
                './css/*.css'
            ],
            options: {
                rev: false,
                watch: {
                    styles: [
                        './css/*.css'
                    ]
                }
            }
        },
        tags: {
            options: {
                rev: false,
                transforms: {
                    scripts: riottransform
                },
                pluginOptions: {
                    'gulp-sourcemaps': {
                        write: {
                            'includeContent': false,
                            'sourceRoot': '/'
                        }
                    }
                }
            },
            scripts: [
                './views/tags/**/*.tag'
            ]
        },
        vendor: {
            scripts: ['./views/vendor/*.js', './views/js/*.js'],
            options: {
                rev: false
            }
        }
    }
};
