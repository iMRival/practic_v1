const gulp = require('gulp');
const concat = require('gulp-concat');
const prefix = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const beautify = require('gulp-html-beautify');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const path = require('path');
const del = require('del');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant'); 
sass.compiler = require('node-sass');

var paths = {
	build: './build',
	sass: './src/sass/',
	js: './src/js/',
	jsDist: './build/js',
	css: './build/css',
	img: './src/img',
	imgDist: './build/img'

};

function pug2html(){
	return gulp.src('./src/*.pug')
			.pipe(pug({
				pretty: true
			}))
			.pipe(gulp.dest(paths.build));
}

function sass2css(){
	return gulp.src(paths.sass + '**/*.scss')
		.pipe(sass())
		.pipe(concat('all.css'))
		.pipe(prefix({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(paths.css))
		.pipe(browserSync.stream());
}

function js2one(){
	return gulp.src([paths.js + '*.js', 
					'node_modules/jquery/dist/jquery.min.js', 
					'node_modules/slick-carousel/slick/slick.min.js'])
		.pipe(concat('all.js'))
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(gulp.dest(paths.jsDist))
		.pipe(browserSync.stream());
}

function img2build(){
	return gulp.src(paths.img + '*.png')
		.pipe(gulp.dest(paths.imgDist))
		.pipe(browserSync.stream());
}

function clean(){
	return del(['build/*']);
}

gulp.task('pug', pug2html);
gulp.task('sass', sass2css);
gulp.task('js', js2one);
gulp.task('clean', clean);
gulp.task('img', img2build);

function watch(){
	browserSync.init({
		server: {
			baseDir: "./build"
		}
	});
	gulp.watch(paths.img + '**/*.png', img2build);
	gulp.watch(paths.js + '**/*.js', js2one);
	gulp.watch(paths.sass + '**/*.scss', sass2css);
	gulp.watch('./src/**/*.pug', pug2html);
	gulp.watch('./build/*.html', browserSync.reload);
}
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, 
						gulp.parallel(pug2html, sass2css, js2one, img2build)
					));

gulp.task('dev', gulp.series('build', 'watch'));

