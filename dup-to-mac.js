/*
Gulp file that copies files from Michael's PC to his Mac

Initially based on this script http://blog.andrewray.me/how-to-copy-only-changed-files-with-gulp/

I'm not adding these packages with --save-dev because it's just used for me 

https://www.npmjs.com/package/del
npm install del

To run this custom gulp script, use it with the --gulpfile option, like so
gulp watch-folder --gulpfile dup-to-mac.js


*/
var gulp = require('gulp');
var del = require('del'); //https://www.npmjs.com/package/del
var path = require('path'); //built in?

// https://msdn.microsoft.com/en-us/library/ff743760%28v=vs.94%29.aspx?f=255&MSPPError=-2147217396
var dateOptions = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};


gulp.task('watch-folder', function() {  
	//Using obj for console reports as described here http://blog.andrewray.me/how-to-copy-only-changed-files-with-gulp/#comment-1937053247
	//Using cwd trick for including new/deleted files as shown here http://stackoverflow.com/a/34346524/461119
	return gulp.watch('www/**/*', {cwd: './'}, function(obj){
	    var currentDate = (new Date()).toLocaleTimeString('en-us', dateOptions);
	    
		console.log(currentDate + " - " + obj.type + ' file: ' + obj.path);
		
		//When something is renamed, a delete type will follow, so we just need to treat the rename as if it's a new file.
		if (obj.type === 'added' || obj.type === 'renamed' || obj.type === 'changed') {
			gulp.src( obj.path, { "base": "./www/"})
			.pipe(gulp.dest('M:\httpplugintest-app/www'));
		}else if (obj.type === 'deleted') {
		
			//Using code from here http://gulpjs.org/recipes/handling-the-delete-event-on-watch.html
			var filePathFromSrc = path.relative(path.resolve('./www/'), obj.path);

			var destFilePath = path.resolve('M:\httpplugintest-app/www', filePathFromSrc);

			console.log("Deleting", destFilePath);
			del.sync(destFilePath, {force: true});
		}else{
			console.error("Unknown action!");
		}
	});
});

