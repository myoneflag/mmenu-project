/*
	Tasks:

	$ gulp 			: Runs the "css" and "js" tasks.
	$ gulp watch	: Starts a watch on the "css" and "js" tasks.

*/

const { src, dest, watch, series, parallel } = require('gulp');

//  For CSS
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

//  For JS
const typescript = require('gulp-typescript');
const webpack = require('webpack-stream');

//  For polyfills
const concat = require('gulp-concat');

//  Dirs
const inputDir = 'src';
const outputDir = 'dist';
const esmDir = 'esm';

/** CSS task */
const css = () => {
    return src(inputDir + '/**/*.less')
        .pipe(less())
        .pipe(autoprefixer({overrideBrowserslist: ['last 2 versions','>5%']}))
        .pipe(dest(outputDir));
};

/** JS transpile task */
const jsTtranspile = () => {
    return src([
        inputDir + '/**/*.d.ts', // Include all typings.
        inputDir + '/**/*.ts' // Include the needed ts files.
    ])
        .pipe(
            typescript({
                target: 'es5',
                module: 'es6'
            })
        )
        .pipe(dest(esmDir));
};

/** JS Pack task */
const jsPack = () => {
    return src(inputDir + '/mmenu-light.js')
        .pipe(
            webpack({
                // mode: 'development',
                mode: 'production',
                output: {
                    filename: 'mmenu-light.js'
                }
                // optimization: {
                //     minimize: false
                // }
            })
        )
        .pipe(dest(outputDir));
};

/*
    $ gulp polyfills
*/
exports.polyfills = cb => {
    //  Some polyfills might rely on others,
    //      therefor we include 'em in a fixed order.
    return src([
        inputDir + '/polyfills/foreach.js',
        inputDir + '/polyfills/matches.js',
        inputDir + '/polyfills/closest.js',
        inputDir + '/polyfills/after.js',
        inputDir + '/polyfills/append.js',
        inputDir + '/polyfills/event.js'
    ])
        .pipe(concat('mmenu-light.polyfills.js'))
        .pipe(dest(outputDir));
};

/*
    $ gulp js
*/
const js = cb => {
    series(jsTtranspile, jsPack)(cb);
};

/*
	$ gulp
*/
exports.default = parallel(css, js);

/*
	$ gulp watch
*/
exports.watch = cb => {
    watch(inputDir + '/**/*.less', css);
    watch(inputDir + '/**/*.ts', js);
    cb();
};
