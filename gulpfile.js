var gulp = require('gulp');
var flatten = require('gulp-flatten');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var notify = require("gulp-notify");
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var filter = require('gulp-filter');
var browserSync = require('browser-sync').create();

// Configurations

// Globs of font files that we want to pack to 'dist' folder.
var fontGlobs = [
    'src/fonts/*.{otf,eot,svg,ttf,woff,woff2,eof}',
    'src/fonts/**/*.{otf,eot,svg,ttf,woff,woff2,eof}',
];

// Globs of CSS and SCSS files that we want to convert to CSS and then compile
// into a single file.
var scssFilesToConvert = [
    'src/scss/app.scss'
];

var scssFilesToWatch = [
    'src/scss/*.scss'
];

var jsFilesToCombine = [
    'src/js/app.js'
];

var jsFilesToWatch = [
    'src/js/*.js'
];

gulp.task('move-fonts', function(){
    return gulp.src(fontGlobs)
        .pipe(flatten())
        .pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('move-images', function() {
    return gulp.src("./src/img/*")
        .pipe(flatten())
        .pipe(gulp.dest('./docs/img/'))
});

// Production specific tasks

gulp.task('scss', function() {
    return gulp.src(scssFilesToConvert)
        .pipe(sass({ errLogToConsole: true }))
        .pipe(concat('app.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./docs/css/'))
        .pipe(notify({
            title: 'Gulp SCSS',
            message: 'SCSS task completed!'
        }))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    return gulp.src(jsFilesToCombine)
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./docs/js/'))
        .pipe(notify({
            title: 'Gulp JS',
            message: 'JS task completed!'
        }))
        .pipe(browserSync.stream());
});

// Development specific tasks

gulp.task('serve-dev', function() {
    browserSync.init({
        server: {
            baseDir: ["./"]
        }
    });
    gulp.watch([scssFilesToWatch], ['scss-dev']);
    gulp.watch([jsFilesToWatch], ['js-dev']);
    gulp.watch("./docs/*.html").on('change', browserSync.reload);
});

gulp.task('scss-dev', function() {
    return gulp.src(scssFilesToConvert)
        .pipe(sass({ errLogToConsole: true }))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./docs/css/'))
        .pipe(notify({
            title: 'Gulp SCSS',
            message: 'SCSS task completed!'
        }))
        .pipe(browserSync.stream());
});

gulp.task('js-dev', function() {
    return gulp.src(jsFilesToCombine)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./docs/js/'))
        .pipe(notify({
            title: 'Gulp JS',
            message: 'JS task completed!'
        }))
        .pipe(browserSync.stream());
});
