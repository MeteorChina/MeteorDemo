if (Meteor.isClient) {

  Template.hello.helpers({
  });

  Template.hello.events({

      'click .download':function(){

          //文件在服务器上的路径
          var uri = encodeURI("http://biblevoice.oss-cn-hangzhou.aliyuncs.com/cuv/创世记第1章.mp3");

          //将要存储到本地的路径
          //可以自己定义文件夹，本示例中使用了voice子目录
          //不支持中文目录和文件名
          var fileURL = cordova.file.applicationStorageDirectory + "Documents/voice/1-1.mp3";

          //实例化文件传输对象
          var fileTransfer = new FileTransfer();
          //开始下载
          fileTransfer.download(
              uri,
              fileURL,
              function(entry) {
                  //下载成功
                  console.log("download complete: " + entry.toURL());
                  alert("download complete: " + entry.toURL());

              },
              function(error) {
                  //下载失败
                  console.log("download error source " + error.source);
                  console.log("download error target " + error.target);
                  console.log("download error code" + error.code);

                  alert("download error: " + error);
              },
              false
          );


      }
  });

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
