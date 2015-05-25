if (Meteor.isClient) {

  Template.hello.helpers({
  });

  Template.hello.events({

      'click .copyfile':function(){

        //注意：本示例暂不支持Android
        //因为org.apache.cordova.file@1.3.3有bug：https://issues.apache.org/jira/browse/CB-6428
        //新版本的cordova-plugin-file@2.0.0，我不知道该如何用到meteor中：https://forums.meteor.com/t/how-to-add-cordova-plugin-file-ver-2-0-0-to-my-meteor-project-notice-it-is-not-org-apache-cordova-file/4821/1

        //iOS
        var filePathSrc = cordova.file.applicationDirectory + "www/application/1-1.mp3";

        //拷贝到 Documents/目录
        var folderDest =  "";

        copy(filePathSrc, folderDest, "gen-1.mp3");

      }
  });


    //拷贝文件函数
    function copy(fromUrl, toPath, toName){
        console.log("copyFile - From: [" + fromUrl + "] To: " + toPath + " Name: " + toName);
        // Set up some storage
        var destPath = '';
        var destName = '';
        doMoveFile(fromUrl);
        // Called when file needs to be moved / after capture
        function doMoveFile(fileUrl){
            //console.log("doMoveFile - fileUrl: " + JSON.stringify(fileUrl));
            // Remember the source file name just in case it was not passed so reuse it, and for logging
            var destName = fileUrl.name;
            var destPath = fileUrl;

            // Resolve the file system
            window.resolveLocalFileSystemURL(fileUrl,resFSSuccess, resFSError);
            // Called upon successful File System resolution
            function resFSSuccess(entry){
                console.log("resFSSuccess Success - entry: " + JSON.stringify(entry));

                // Request a file system
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                                         requestFileSystemSuccess, requestFileSystemError);
                // Called upon successful File System request
                function requestFileSystemSuccess(fileSys){

                    // Get the source directory
                    fileSys.root.getDirectory(toPath, {create: true, exclusive:false}, getDestDirSuccess, getDestDirError);
                    // Called upon successful Get Of Destination Directory
                    function getDestDirSuccess(directory){
                        // Get the destination file name, set it if it is blank or not passed by the App
                        toName = (toName) ? toName : destName;
                        // Remember the full path name for the console log
                        fullDestPath = directory.fullPath + '/' + toName;

                        // Make the move
                        entry.copyTo(directory, toName, moveSuccess, moveError);

                    }
                    // Get Destination Dir Failure
                    function getDestDirError(error){
                        console.log("getDestDirError code: " + JSON.stringify(error));
                    };     
                }
                // File System Request Failure
                function requestFileSystemError(error){
                    console.log("requestFileSystemError code: " + JSON.stringify(error));
                };
            }
            // Note File System failure
            function resFSError(error){
                console.log("resFSError code: " + JSON.stringify(error));
            };
        }
    }

    //成功回调，原来是放到copy函数中的，我认为拿出来使用更方便
    function moveSuccess(){
        // console.log("Successful copy of " + destPath + " to " + fullDestPath);

        //拷贝文件成功，在这里做下一步操作
        alert("Successful");
    };

    //错误回调
    function moveError(error){
        console.log("copyError code: " + JSON.stringify(error));
    };



}





if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
