Session.setDefault('fileList', []);
Session.setDefault('currPath', '/');

Template.fileManager.rendered = function () {

	initFileSystem();
};

Template.fileManager.helpers({
	fileList: function(){
		return Session.get('fileList');
	},
	currPath: function(){
		return Session.get('currPath');
	}
});

Template.fileManager.events({
	'click .ev-root-dir': function () {

		//遍历根目录
		readDir(fs.root);
	},
	'click .ev-mode': function () {
		// var URL3 = cordova.file.applicationStorageDirectory;
		// var URL6 = cordova.file.tempDirectory;
		// var URL9 = cordova.file.dataDirectory;
		// var URL12 = cordova.file.cacheDirectory;

		alert('模式：' + fs.name); 
	},
	'click .ev-delete-file': function () {

		fs.root.getDirectory('music', {}, function(dirEntry) {
			dirEntry.removeRecursively(function() { 
				alert('Directory removed.');

				//遍历根目录
				readDir(fs.root);

			}, errorHandler);
		}, errorHandler); 
	},
	'click .ev-create-file': function () {

		var path = 'music/jazz/';

		function createDir(rootDirEntry, folders) {
		  // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
		  if (folders[0] == '.' || folders[0] == '') {
		  	folders = folders.slice(1);
		  }
		  rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
			    // Recursively add the new subfolder (if we still have another to create).
			    if (folders.length) {
			    	createDir(dirEntry, folders.slice(1));
			    }
			    console.log(dirEntry.fullPath);
			}, errorHandler);
		};
		//递归建立多层级目录
		createDir(fs.root, path.split('/')); // fs.root is a DirectoryEntry.

		//遍历根目录
		readDir(fs.root);

		setTimeout(createFile, 1000);

		function createFile(){
			//确保父目录music/jazz/存在，才可以建立新文件5.mp3。上面采用异步递归，不能保证目录建立完，有bug。无奈延迟一秒
			fs.root.getFile("music/jazz/5.mp3", {create: true}, null, errorHandler);
		}		
	},
	'click .ev-go-back': function () {

		//遍历父级目录
		currDirEntry.getParent(function(dirEntry){
			readDir(dirEntry);
		}, errorHandler);
	}
});