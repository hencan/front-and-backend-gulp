var gulp = require("gulp");
var less = require("gulp-less");
var concat = require("gulp-concat");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var cleanCSS = require("gulp-clean-css");
var webserver = require("gulp-webserver");

//Source Path
var less_src = ["src/*.less", "src/app/*.less", "src/app/less/*.less"];
var html_scr = ["src/app/*.html", "src/app/html/*.html"];
var babel_scr = "src/app/js/*.js";
var js_scr = "src/app/babel/*.js";
var assets_src = [
  "src/assets/*.*",
  "src/assets/images/*.*",
  "src/assets/db/*.*",
];

// Dist Path
var less_dist = "dist";
var html_dist = "dist";
var babel_dist = "src/app/babel";
var js_dist = "dist";
var assets_dist = "dist/assets";

//Compile Less, Minify and Concat CSS
gulp.task("compile-less", function () {
  return gulp
    .src(less_src)
    .pipe(
      less().on("error", function (err) {
        console.log(err);
      })
    )
    .pipe(cleanCSS())
    .pipe(concat("style.css"))
    .pipe(gulp.dest(less_dist));
});

//Minify and Html
gulp.task("minify-html", function () {
  return gulp
    .src(html_scr)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(html_dist));
});

//Convert Js ES6 to ES5
gulp.task("convert_es6_es5", function () {
  return gulp
    .src(babel_scr)
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(gulp.dest(babel_dist));
});

//Minify and Concat Js
gulp.task("minify-js", function () {
  return gulp
    .src(js_scr)
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat("script.js"))
    .pipe(gulp.dest(js_dist));
});

//Copy Assets
gulp.task("copy-assets", function () {
  return gulp.src(assets_src).pipe(gulp.dest(assets_dist))
  .on('end', function(){ console.log('*** Project available in the "disp" folder ***'); })
});

//Webserver
gulp.task("webserver", function () {
  gulp.src("dist").pipe(
    webserver({
      livereload: true,
      directoryListing: true,
      open: "index.html",
    })
  );
});

//Monitoring files changes
gulp.task("monitoring", function () {
  gulp.watch(less_src, gulp.series("compile-less"));
  gulp.watch(html_scr, gulp.series("minify-html"));
  gulp.watch(babel_scr, gulp.series("convert_es6_es5"));
  gulp.watch(js_scr, gulp.series("minify-js"));
  gulp.watch(assets_src, gulp.series("copy-assets"));
});

//Development task
gulp.task(
  "serve",
  gulp.series(
    "compile-less",
    "minify-html",
    "convert_es6_es5",
    "minify-js",
    "copy-assets",
    gulp.parallel("monitoring", "webserver")
  )
);

//Build task
gulp.task(
  "build",
  gulp.series(
    "compile-less",
    "minify-html",
    "convert_es6_es5",
    "minify-js",
    "copy-assets"
  )
);
