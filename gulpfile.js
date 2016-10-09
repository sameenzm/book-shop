var gulp = require('gulp');
var dot = require('dot');
var del = require('del');
var rename = require('gulp-rename');
var dotCompile = require('gulp-dot2module');

var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imageMin = require('gulp-imagemin');
var rev = require('gulp-rev-append');

var DIST = './dist/';
var SRC = './src/';

var paths = {
    html: [SRC + 'tpl/*.html'],
    css: [SRC + 'vendor/**/*.css', SRC + 'css/*.css'],
    vendorJSList: [SRC + 'vendor/require.js', SRC + 'vendor/jquery/jquery.min.js',
        SRC + 'vendor/jquery-ui/jquery-ui.min.js', SRC + 'vendor/promise.min.js'],
    js: [DIST + 'tpl/*.js', SRC + 'js/*.js', SRC + 'lib/*.js'],
    img: [SRC + 'img/**/*.jpg', SRC + './img/**/*.png', SRC + './img/**/*.jpeg', SRC + './img/**/*.gif']
};

gulp.task('default', ['move', 'js', 'css', 'rev', 'img']);

gulp.task('move', function (cb) {
    del.sync(DIST);
    gulp.src([SRC + 'mock/**/*', SRC + 'vendor/es5-shim.min.js'], {base: SRC})
        .pipe(gulp.dest(DIST));
    gulp.src([SRC + 'vendor/font-awesome/fonts/*'])
       .pipe(gulp.dest(DIST + 'css/font-awesome/fonts'));
    gulp.src([SRC + 'vendor/jquery-ui/images/*'])
        .pipe(gulp.dest(DIST + 'css/jquery-ui/images'));
    gulp.src([SRC + 'index.html'])
        .pipe(gulp.dest(DIST))
        .on('end', function () {
            cb();
        });
});

gulp.task('css', ['move'], function(cb) {
    gulp.src(paths.css)
        .pipe(concatCss("bundle.css"))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(DIST + 'css'))
        .on('end', function () {
            cb();
        });
});

gulp.task('js', ['css'], function(cb) {
    gulp.src(paths.html, {base: SRC})
        .pipe(rename(function (path) {
            path.basename = 'tpl_' + path.basename;
        }))
        .pipe(dotCompile())
        .pipe(gulp.dest(DIST))
        .on('end', function () {
            gulp.src(paths.vendorJSList.concat(paths.js))
                .pipe(uglify({mangle: false}))
                .pipe(concat('bundle.js'))
                .pipe(gulp.dest(DIST + 'js'))
                .on('end', function () {
                    del.sync([DIST + 'tpl']);
                    cb();
                })
        });
});

gulp.task('rev', ['js'], function () {
    gulp.src(DIST + 'index.html')
        .pipe(rev())
        .pipe(gulp.dest(DIST));
});

gulp.task('img', function () {
    gulp.src(paths.img)
        .pipe(imageMin())
        .pipe(gulp.dest(DIST + 'img'))
});
