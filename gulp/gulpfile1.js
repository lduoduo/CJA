'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var replace = require('gulp-replace');
var del = require('del');
var glob = require('glob');
var path = require('path');

// 报错抛出提示
var onError = function (err) {
    gutil.log('======= ERROR. ========\n');
    notify.onError("ERROR: " + err.message)(err); // for growl
    gutil.beep();
};

function buildCss(styleSrc){
    gulp.src(styleSrc, {client: './'})
        .pipe(plumber({errorHandler: onError}))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./app/dest/css'))
        .on('finish', function(){});
}

// require编译
function bundle(b, file) {
    return b.bundle()
        .on("error", notify.onError(function (error) {
            gutil.log('======= ERROR. ========\n', error);
            return "Message to the notifier: " + error.message;
        }))
        .pipe(source(file))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./app/dest/js'));
}


// 根据变动生成css与js
function buildCssAndJs(){

    watch('app/src/**/!(_)*.less',function(event) {

        var path = event.path.replace(/\\/g, '/'),
            reg = path.match(/(\/app\/src(\/\w+)*)?\/([\w]+.less)?$/),
            src = reg[0];

        buildCss(src.substring(1));
        gutil.log(gutil.colors.green("SUCCESS: " + src.substring(1) + '  finished!'));

    });

    watch(['app/src/**/!(_)*.js'],function(event) {

        var path = event.path.replace(/\\/g, '/');

        var reg = path.match(/\/((app\/(src|tpl\/build)\/(\w+)*)?\/([\w]+.js))?$/),
            src = reg[1],
            fileName = reg[5];


        var b = watchify(browserify(assign({}, watchify.args, {
            cache: {},
            packageCache: {},
            entries: [src]
        })));

        b.on('log', gutil.log);

        bundle(b, fileName);

        return;
    });

}

/*
 编译所有的less
 */
function Less(callback){

    glob('app/src/**/!(_)*.less', {}, function (err, files) {

        files.forEach(function (file) {

            buildCss(file);

            gutil.log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

        });

        callback();
    });
}


/*
 编译所有的js
 注：执行此命令的时候请注释掉下面的 [default]任务行
 */
function reset(callback){

    glob('app/src/**/!(_)*.js', {}, function (err, files) {

        files.forEach(function (file) {

            var reg = file.match(/(app\/src\/(\w+)*)?\/([\w]+.js)?$/),
                fileName = reg[3];

            var b = watchify(browserify(assign({}, watchify.args, {
                cache: {},
                packageCache: {},
                entries: [file]
            })));

            bundle(b, fileName);

            gutil.log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

        });
    });

    callback();
}


/**
 *  gulp build
 */

/*
 * clean output
 * */
function clean(callback){
    // del.sync(['app/output/**', '!app/output']);
    callback();
}
/*
 * clean uplod.json
 * */
function cleanUpload(callback) {
    // writeJson('./upload.json', []);
    callback();
}


/*
 *
 * minCss
 *
 * */

function minCss(callback){
    return gulp.src('./app/dest/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('app/min/css'))
        .on('finish', callback);
}

/*
 *
 * compress
 *
 * */
function compress(callback){
    return gulp.src('app/dest/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('app/min/js'))
        .on('finish', callback);
}

/*
 *
 * find illegal in content
 * */

function findIllegalChar(callback){

    return gulp.src("app/min/js/*.js")
        .pipe(notify(function (file) {

            var fileName = file.relative;
            // 将buffer 转为字符串
            var content = String(file.contents);
            var aIllegal = content.match(tpl.illegal);

            if(aIllegal){
                return gutil.colors.yellow('Found ' + aIllegal + ' in ' + fileName);
            }
        }))
        .on('finish', callback);
}

/*
 *
 * FTP Part
 *
 * */

/*
 *
 * read json
 *
 * */
function readJson(fileName){
    var json = JSON.parse(fs.readFileSync(fileName));

    return json;
}

/*
 *
 * write json
 *
 * */
function writeJson(fileName, data){

    fs.writeFileSync(fileName, JSON.stringify(data));
}

//default task
gulp.task(buildCssAndJs);

//编译所有的less
gulp.task(Less);
//编译所有的js
gulp.task(reset);


gulp.task('default', gulp.series('reset', 'Less', 'buildCssAndJs'));

gulp.task('compile', gulp.series('reset', 'Less'));
