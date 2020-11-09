const gulp = require('gulp');
const del = require('del');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const eslint = require('gulp-eslint');

// 基础路径
const srcPath = './src/**';
const buildPath = './dist/';

// 编译wxml文件
const wxmlFiles = [`${srcPath}/*.wxml`];
const wxml = () => {
  return gulp.src(wxmlFiles, { since: gulp.lastRun(wxml) })
    .pipe(gulp.dest(buildPath));
};
gulp.task(wxml);

// 编译less、sass、wxss文件
const lessOrSassFiles = [
  `${srcPath}/*.scss`,
  `${srcPath}/*.less`,
  `${srcPath}/*.wxss`
];
const isLess = (file) => {
  return Object.is(file.extname, '.less');
};
const wxss = () => {
  return gulp.src(lessOrSassFiles, { since: gulp.lastRun(wxss) })
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(isLess, less()))
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest(buildPath));
};
gulp.task(wxss);

// 编译js文件
const jsFiles = [`${srcPath}/*.js`, `!./src/env/*.js`];
const js = () => {
  return gulp.src(jsFiles, { since: gulp.lastRun(js) })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest(buildPath));
};
gulp.task(js);

// 编译json文件
const jsonFiles = [`${srcPath}/*.json`];
const json = () => {
  return gulp.src(jsonFiles, { since: gulp.lastRun(json) })
    .pipe(gulp.dest(buildPath));
};
gulp.task(json);

// 编译图片
const imgFiles = [
  `${srcPath}/*.{jpg, png, gif, ico}`
];
const img = () => {
  return gulp.src(imgFiles, { since: gulp.lastRun(img) })
    .pipe(imagemin())
    .pipe(gulp.dest(buildPath))
};
gulp.task(img);

// 接口地址配置
const config = env => {
  return () => {
    return gulp.src(`./src/env/${env}.js`, { since: gulp.lastRun(config) })
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(rename('env.js'))
      .pipe(gulp.dest(buildPath));
  };
};
gulp.task('development', config('development'));
gulp.task('production', config('production'));

// 清除build目录下的所有文件
gulp.task('clean', (done) => {
  del.sync(['dist/**/*']);
  done();
});

// 监听文件
gulp.task('watch', () => {
  gulp.watch(wxmlFiles, wxml);
  gulp.watch([...lessOrSassFiles], wxss);
  gulp.watch(jsFiles, js);
  gulp.watch(jsonFiles, json);
  gulp.watch(imgFiles, img);
});

// development环境
gulp.task('dev',
  gulp.series(
    'clean',
    gulp.parallel('wxml', 'wxss', 'js', 'json', 'img', 'development'),
    'watch'
  )
)

// production环境
gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel('wxml', 'wxss', 'js', 'json', 'img', 'production'),
    'watch'
  )
)
