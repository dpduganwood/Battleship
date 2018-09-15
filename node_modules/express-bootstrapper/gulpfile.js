/* jshint node: true */
'use strict';

let gulp = require('gulp');
let jshint = require('gulp-jshint');
let jscs = require('gulp-jscs');
let seq = require('gulp-sequence');
let srcFiles = ['./express-bootstrapper.js', './example/test/*.js'];

gulp.task('jscs', function() {
  return gulp.src(srcFiles)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('jshint', function() {
  return gulp.src(srcFiles)
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint', seq('jshint', 'jscs'));
