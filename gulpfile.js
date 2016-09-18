var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs-extra');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var avInjector = require('av-gulp-injector');

var get_config = function() {
    var config_str = fs.readFileSync('frontlab.json');
    return JSON.parse(config_str);
};

var report_error = function(error) {
    $.notify({
        title: 'An error occured with a Gulp task',
        message: 'Check you terminal for more informations'
    }).write(error);

    console.log(error.toString());
    this.emit('end');
};

gulp.task('styles', function () {
    var config = get_config();
    return gulp.src(config.sass_src + '/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
        precision: 6,
        outputStyle: 'expanded',
        sourceComments: true,
        indentWidth: 4,
    }))
    .on('error', report_error)
    .pipe($.autoprefixer({
        browsers: [
            'ie >= 10',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
        ]
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.sass_dest))
    .pipe($.size({title: 'styles'}));
});

gulp.task('copy-public', function() {
    var config = get_config();
    return gulp.src(config.public_src + '/public/**/*', { dot: true })
        .pipe(gulp.dest(config.public_dest + '/public'))
        .pipe($.size({ title: 'public' }));
});

gulp.task('templates', function() {
    var config = get_config();
    return gulp.src(config.twig_src + '/*.html.twig')
        .pipe($.twig())
        .pipe($.extReplace('.html', '.html.html'))
        .pipe($.prettify({ indent_size: 2 }))
        .pipe(gulp.dest(config.twig_dest))
        .pipe($.size({title: 'twig'}));
});

gulp.task('watch', ['default'], function() {
    var config = get_config();

    browserSync({
        notify: false,
        logPrefix: 'FrontLab',
        server: [config.twig_dest]
    });

    gulp.watch(config.sass_src + '/**/*.{scss, css}', ['styles', reload]);
    gulp.watch(config.twig_src + '/**/*.{html.twig, twig}', ['templates', reload]);
    gulp.watch(config.public_src + '/public/**/*', ['copy-public', reload]);
});

gulp.task('injector', function() {
    var config = get_config();

    var injectorAliases = {
        '@bower': config.public_src + '/public/bower_components',
    };

    avInjector.injector(gulp.src([
        config.sass_src + '/**/*.scss',
        config.twig_dest + '/**/*.html',
    ]), injectorAliases, true);
});

gulp.task('default', function(cb) {
    runSequence(
        ['injector'],
        ['styles', 'templates',],
        ['copy-public',],
        cb
    );
});
