// 文件系统
fs = {};

//当前目录实体
currDirEntry = {};

//初始化 文件系统
initFileSystem = function () {

	function onInitFs(filesystem) {
		// alert('Opened file system: ' + filesystem.name);

		fs = filesystem;
		currDirEntry = fs.root;
	}

	window.requestFileSystem(window.PERSISTENT, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);
}

//读取当前目录下文件
readDir = function readDir(dirEntry){

	Session.set('currPath', dirEntry.fullPath);
	currDirEntry = dirEntry;
	var fileList = [];		
	var dirReader = dirEntry.createReader();
	var entries = [];

	// Call the reader.readEntries() until no more results are returned.
	var readEntries = function() {
		dirReader.readEntries (function(results) {
			if (!results.length) {
				listResults(entries.sort());
			} else {
				entries = entries.concat(toArray(results));
				readEntries();
			}
		}, errorHandler);
	};

	readEntries(); // Start reading dirs.

	function toArray(list) {
		return Array.prototype.slice.call(list || [], 0);
	}

	function listResults(entries) {
		entries.forEach(function(entry, i) {
			var fileItem = {};
			fileItem.isFolder = entry.isDirectory;
			fileItem.fileName = entry.name;
			fileList.push(fileItem);
		});
		
		Session.set('fileList', []);
		Session.set('fileList', fileList);

		//alert('读到了' + fileList.length + '个文件，第一个文件名叫' + fileList[0].fileName);
	}
}

errorHandler = function errorHandler(e) {
	var msg = '';

	switch (e.code) {
		case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
		case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
		case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
		case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
		case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
		default:
		msg = 'Unknown Error';
		break;
	};

	alert('Error: ' + msg);
}

