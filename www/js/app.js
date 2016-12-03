// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
		.run(function ($ionicPlatform) {
			$ionicPlatform.ready(function () {
				if (window.cordova && window.cordova.plugins.Keyboard) {
					// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
					// for form inputs)
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

					// Don't remove this line unless you know what you are doing. It stops the viewport
					// from snapping when text inputs are focused. Ionic handles this internally for
					// a much nicer keyboard experience.
					cordova.plugins.Keyboard.disableScroll(true);
				}
				if (window.StatusBar) {
					StatusBar.styleDefault();
				}

				$(".start").on("click", startStopDownload);
				$(".del").on("click", deleteFile);
				$(".md5button").on("click", showMd5);
				$(".filesize").on("click", filesize);
				$(".abort").on("click", abortDownload);
			});
		});




var APP_FOLDER = "AppForPlugins";
var SONG_URL = "https://traffic.libsyn.com/secure/mixergy/1.mp3";
//var SONG_URL = "https://secure-hwcdn.libsyn.com/p/6/2/3/6236f647b7714eba/1.mp3?c_id=7997049&expiration=1478822879&hwt=34eb10ebbfd67c097f5af5266deedf7f";
var FILE_NAME = "1.mp3";

var downloadInProgress = false;

var fileTransfer;

function startStopDownload() {

	if (downloadInProgress) {
		console.log("Download happening, so we'll abort.", downloadInProgress);
		// stop download
		downloadInProgress = false;
		//cordovaHTTP.abortDownload();
		fileTransfer.abort();
		

	} else {
		console.log("New download request.", downloadInProgress);
		// start download
		startDownload(FILE_NAME);

	}

}

function startDownload(filename) {

	// check if file already exists then calculate its length
	getFile(filename, false, function (fileEntry) {
		console.log("File exists.", fileEntry);

		fileEntry.getMetadata(
				function (metadata) {
					var size = metadata.size;
					console.log("File size: " + size);

					if (size < 0) {
						size = 0;
					}

					startDownloadFrom(filename, size);
				},
				function (error) {
					alert("Error in getting File size: " + error);
				}
		);


	}, function (err) {
		console.log("File does not exist.", err);
		// file does not exist so start a fresh download
		startDownloadFrom(filename, 0);
	});

}

function startDownloadFrom(filename, range) {

	// First create file or get already created file.
	getFile(filename, true, function (fileEntry) {

		// File is created now start downloading
		downloadInProgress = true;

		var headers = {};

		if (range > 0) {
			headers = {"Range": "bytes=" + range + "-"}
		}

		console.log("headers", headers);

		fileTransfer = new FileTransfer();
			
		fileTransfer.onprogress = function(progress) {
			$("#progress").text(progress.loaded);
		};
		
		fileTransfer.download(
				SONG_URL,
				fileEntry.toURL(),
				function (entry) {
					console.log("download complete: " + entry.toURL());
					downloadInProgress = false;
				},
				function (error) {
					console.log("error", error);
					downloadInProgress = false;
				},
				false,
				{
					headers: headers
				}
		);

//		cordovaHTTP.downloadFile(SONG_URL,
//				{},
//				headers,
//				fileEntry.toURL(),
//				true, // append download to file if exists else create new one
//				function (entry) {
//					downloadInProgress = false;
//
//					// prints the filePath
//					alert("File is downloaded successfully at location:\n" + entry.fullPath);
//
//				}, function (response) {
//			// check if it is aborted
//			if (response.status == -1) {
//				// it is aborted
//				alert(response.error);
//			} else {
//				alert("Error in downloading file");
//			}
//			downloadInProgress = false;
//		}, function (resp) {
//			$("#progress").text(resp.progress);
//			$("#headers").text(JSON.stringify(resp.headers));
//		});

	}, function (error) {
		alert("Error in creating file in memory");
	});

}

function abortDownload() {
	// stop download
	downloadInProgress = false;
//	cordovaHTTP.abortDownload();
	fileTransfer.abort();
}


function deleteFile() {
	removeFile(FILE_NAME);
}

function removeFile(filename) {
	getFile(filename, false, function (fileEntry) {

		fileEntry.remove(function (file) {
			$("#progress").text("");
			$("#headers").text("");
			$("#md5").text("");
			alert("File removed!");
		}, function () {
			alert("error deleting the file " + error.code);
		});

	}, function (err) {
		alert("File does not exist");

	});

}

function showMd5() {
	getFile(FILE_NAME, false, function (fileEntry) {

		md5chksum.file(fileEntry, function (md5sum) {  
			$("#md5").text(md5sum);
		}, function (error) {
			$("#md5").text("Error-Message: " + error);
		});

	}, function (err) {
		alert("File does not exist");

	});
}

function getFile(filename, newIfMissing, success, error) {
	createAppDirectory(newIfMissing, function (dirEntry) {
		dirEntry.getFile(filename, {create: newIfMissing, exclusive: false}, function (fileEntry) {
			success(fileEntry);
		}, error);
	}, error)
}

function createAppDirectory(newIfMissing, success, fail) {
	//iOS version
	window.resolveLocalFileSystemURL(cordova.file.documentsDirectory, function (rootDirEntry) {
		rootDirEntry.getDirectory(APP_FOLDER, {create: newIfMissing}, function (dirEntry) {
			success(dirEntry);
		}, fail);
	}, fail);
	//Android version
//	window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (rootDirEntry) {
//		rootDirEntry.getDirectory(APP_FOLDER, {create: newIfMissing}, function (dirEntry) {
//			success(dirEntry);
//		}, fail);
//	}, fail);
}

function filesize() {
// check if file already exists then calculate its length
	getFile(FILE_NAME, false, function (fileEntry) {

		fileEntry.getMetadata(
				function (metadata) {
					var size = metadata.size;
					alert("File size: " + size);

				},
				function (error) {
					console.log("Error in File size: " + error);
				}
		);


	}, function (err) {
		// file does not exist so start a fresh download
		alert("File not exists");
	});
}
