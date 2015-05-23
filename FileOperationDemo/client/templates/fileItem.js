Template.fileItem.events({
	'click .item': function () {
		if (!this.isFolder){
			alert("not a folder");
			return;
		} 

		//遍历点击的目录
		currDirEntry.getDirectory(this.fileName, {create: false}, function(dirEntry) {

			readDir(dirEntry);

		}, errorHandler);
	}
});