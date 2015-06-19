var gulpLoadPlugins = require('gulp-load-plugins'),
	del = require('del'),
	path = require('path'),
	runSequence = require('run-sequence'),
 	webpack = require('gulp-webpack-build'),
	minimist = require('minimist'),
	$ = gulpLoadPlugins(),
	argv = minimist(process.argv.slice(2)),
	src = Object.create(null);

function initConfig(gulp){
	var watch = false,
		browserSync,
		src = './app',
    	dest = './build/',
	    webpackOptions = {
	        debug: true,
	        devtool: '#source-map',
	        watchDelay: 200
	    },
	    webpackConfig = {
	        useMemoryFs: true,
	        progress: true
	    },
	    CONFIG_FILENAME = webpack.config.CONFIG_FILENAME;

	// The default task
	gulp.task('default');

	// Clean output directory
	gulp.task('clean', function () {
		del(['.tmp', 'build/*', '!build/.git'], {dot: true});
	});

	// Static files
	gulp.task('assets', function () {
		src.assets = [
		    'package.json',
		    'app/assets/**',
		    'app/content*/**/*.*',
		    'app/templates*/**/*.*'
		];
	  
	  return gulp.src(src.assets)
	    .pipe($.changed('build'))
	    .pipe(gulp.dest('build'))
	    .pipe($.size({title: 'assets'}));
	});

	gulp.task('webpack', [], function() {
	    return gulp.src('app/**/*.js', {
		    	cwd: process.env.PWD
		    })
	    	.pipe(webpack.closest(CONFIG_FILENAME))
	        .pipe(webpack.init(webpackConfig))
	        .pipe(webpack.props(webpackOptions))
	        .pipe(webpack.run())
	        .pipe(webpack.format({
	            version: false,
	            timings: true
	        }))
	        .pipe(webpack.failAfter({
	            errors: true,
	            warnings: true
	        }))
	        .pipe(gulp.dest(dest));
	});

	// Build the app from source code
	gulp.task('build', ['clean'], function (cb) {
		runSequence(['assets', 'bundle'], cb); 
	});

	// Build and start watching for modifications
	gulp.task('build:watch', function (cb) {
		watch = true;
		runSequence('build', function () {
			gulp.watch(src.assets, ['assets']);
			cb();
		});		
	});
}

module.exports = initConfig;

