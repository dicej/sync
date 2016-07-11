'use strict'

const gulp = require('gulp'),
      gutil = require('gulp-util'),
      typings = require('gulp-typings'),
      ts = require('gulp-typescript'),
      sourcemaps = require('gulp-sourcemaps'),
      mocha = require('gulp-mocha')

gulp.task('typings',function(){
  return gulp.src('./typings.json').pipe(typings())
})

let typescriptErrorCount = 0

gulp.task('typescriptMaybe', ['typings'], () => {
  return gulp.src(['src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(ts({module: 'commonjs',
              noEmitOnError: true,
              noImplicitAny: true}))
    .on('error', function (error) {
      if (++ typescriptErrorCount > 20) {
        process.exit(-1)
      }
    })
    .js
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
})

gulp.task('typescript', ['typescriptMaybe'], () => {
  if (typescriptErrorCount > 0) {
    process.exit(-1)
  }
  return true
})

let mochaOptions = gutil.env.grep ? { grep: gutil.env.grep } : { }

gulp.task('test', ['typescript'], () => {
  return gulp.src(['./build/**/*-tests.js']).pipe(mocha(mochaOptions))
})

gulp.task('watch', () => {
  gulp.watch('src/**/*.ts', ['test'])
})

gulp.task('default', ['test'])
