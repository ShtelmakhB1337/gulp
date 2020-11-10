let projectFolder = "dist";
let sourceFolder = "src";

let path = {
    build: {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        fonts: projectFolder + "/fonts/",
    },
    src: {
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/scss/style.scss",
        js: sourceFolder + "/js/script.js",
        img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/*.ttf",
    },
    watch: {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + projectFolder + "/"
}

let {src,dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    groupMedia = require('gulp-group-css-media-queries'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,

    function browserSync(params) {
        browsersync.init({
            server: {
                baseDir: "./" + projectFolder + "/"
            },
            port:3000,
            notify: false
        })
    }

    function html() {
        return src(path.src.html)
            .pipe(fileinclude())
            .pipe(dest(path.build.html))
            .pipe(browsersync.stream())
    }

    function css() {
        return src(path.src.css)
            .pipe(
                scss({
                    outputStyle: "expanded"
                })
            )
            .pipe(
                autoprefixer({
                    overrideBrowserslist: ["last 5 versions"],
                    cascade: true
                })
            )
            .pipe(
                groupMedia()
            )
            .pipe(dest(path.build.css))
            .pipe(cleanCss())
            .pipe(
                rename({
                    extname: ".min.css"
                })
            )
            .pipe(dest(path.build.css))
            .pipe(browsersync.stream())
    }

    function js() {
        return src(path.src.js)
            .pipe(fileinclude())
            .pipe(dest(path.build.js))
            .pipe (
                uglify()
            )
            .pipe(
                rename({
                    extname: ".min.js"
                })
            )
            .pipe(dest(path.build.js))
            .pipe(browsersync.stream())
    }

    function watchFiles(params) {
        gulp.watch([path.watch.html],html);
        gulp.watch([path.watch.css],css);
        gulp.watch([path.watch.js],js);
    }

    function clean(params) {
        return del(path.clean);
    }

    let build = gulp.series(clean, gulp.parallel(js, css, html, fonts));
    let watch = gulp.parallel(build, watchFiles, browserSync);

    exports.build = build;
    exports.js = js;
    exports.css = css;
    exports.html = html;
    exports.watch = watch;
    exports.default = watch;
