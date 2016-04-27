var gulp = require('gulp')
var cached = require('gulp-cached')
var rename = require('gulp-rename')
var cssnano = require('gulp-cssnano')
var autoprefixer = require('gulp-autoprefixer')
var sass = require('gulp-sass')
var bytediff = require('gulp-bytediff')



// sass
gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.scss')  // 传入 sass 目录及子目录下的所有 .scss 文件生成文件流通过管道
    .pipe(cached('sass'))  // 缓存传入文件，只让已修改的文件通过管道（第一次执行是全部通过，因为还没有记录缓存）
    .pipe(sass({includePaths: ['.'],outputStyle: 'expanded'})) // 编译 sass 并设置输出格式
    .pipe(autoprefixer('last 5 version')) // 添加 CSS 浏览器前缀，兼容最新的5个版本
    .pipe(gulp.dest('dist/css')) // 输出到 dist/css 目录下（不影响此时管道里的文件流）
    .pipe(rename({suffix: '.min'})) // 对管道里的文件流添加 .min 的重命名
    .pipe(bytediff.start())//记录文件大小变化
    .pipe(cssnano()) // 压缩 CSS
    .pipe(bytediff.stop(function(data) {
        var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
        return data.fileName + ' is ' + (100-Math.round(data.percent*10000)/100) + '%' + difference;
    }))
    .pipe(gulp.dest('dist/css')) // 输出到 dist/css 目录下，此时每个文件都有压缩（*.min.css）和未压缩(*.css)两个版本
});


gulp.task('watch', function() {
  gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('default',['watch']);