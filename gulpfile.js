const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');
const svgSprite = require('gulp-svg-sprite');
const	cheerio = require('gulp-cheerio');
const newer = require('gulp-newer');
// const fileinclude = require('gulp-file-include');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		notify: false
	})
}

function styles() {
	return src('app/scss/style.scss')
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 versions'],
			grid: true
		}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}


function scripts() {
	return src([
		'node_modules/slick-carousel/slick/slick.js',
		'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
		// 'node_modules/mixitup/dist/mixitup.min.js',
		// 'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
		'node_modules/rateyo/src/jquery.rateyo.js',
		// 'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
		'app/js/main.js'
	])
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

function images() {
	return src('app/images/**/*.*')
	.pipe(newer('dist/images'))
	.pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
        ]
    })
	]))
	.pipe(dest('dist/images'))
}

function svgSprites() {
	return src('app/images/sprite/**.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg',
					render: {
						scss: {
							dest:'../../scss/_sprite.scss'
						}
					}
				}
			}
		}))

		.pipe(dest('app/images'))
}

function cheerioFunc() {
		return src('app/images/sprite/**.svg')
			.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(dest('app/images/sprite'))
}


function cleanDist() {
	return del('dist');
}

// function includeHtml() {
// 	return src('app/html/**/[^_]*.html')
// 	.pipe(fileinclude({
//       prefix: '@',
//       basepath: '@file'
//     }))
//   .pipe(dest('app'))
// 	.pipe(browserSync.stream())
// }

function watching() {
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts),
	// watch(['app/images/sprite/**.svg'], cheerioFunc),
	watch(['app/images/sprite/**.svg'], svgSprites),
	// watch(['app/html/**/*.html'], includeHtml)
	watch(['app/**/**/*.html']).on('change', browserSync.reload)
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.svgSprites = svgSprites;
exports.cleanDist = cleanDist;
exports.cheerioFunc = cheerioFunc;
// exports.includeHtml = includeHtml;

exports.default = parallel(styles, scripts, cheerioFunc, svgSprites, browsersync, watching);


function build() {
	return src([
		'app/**/*.html',
		'app/css/style.min.css',
		'app/js/main.min.js'
	], {base: 'app'})
	.pipe(dest('dist'))
}

exports.build = series(cleanDist, parallel(styles, scripts, cheerioFunc, svgSprites), images, build);