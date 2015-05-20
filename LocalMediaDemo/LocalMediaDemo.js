if (Meteor.isClient) {

  //media对象实例
  var _myMedia;

  Meteor.startup(function () {
    //允许后台播放
    cordova.plugins.backgroundMode.enable();
  });


  Template.hello.helpers({
  });

  Template.hello.events({

      //初始化音频
      'click .init_audio':function(){
        //1. 可以播放documents目录下的文件
        // var url = "documents://voice/创世记第1章.mp3";

        //2. 也可以播放www目录下的文件
        var url = "application/voice/创世记第1章.mp3";
        _myMedia = new Media(url, successCallback, errorCallback, statusCallback);
        console.log("Init Audio");
      },

      //播放
      'click .play_audio':function(){
        _myMedia.play();
        console.log("Play Audio");
      },

      //暂停
      'click .pause_audio':function(){
        _myMedia.pause();
        console.log("Pause Audio");
      },

      //停止
      //注意，这里没有使用stop()是为了和播放完成后自动停止的事件相区分
      'click .stop_audio':function(){
        _myMedia.seekTo(0);
        _myMedia.pause();
        console.log("Stop Audio");
      },

      //获得播放进度和总时长
      'click .get_position':function(){
        var dur = _myMedia.getDuration();

        _myMedia.getCurrentPosition(
            // success callback
            function (position) {
                  console.log("Current Position: " + position + " / " + dur);
            },
            // error callback
            function (e) {
                console.log("Error Getting Position=" + e);
            }
        );

      },

      //快进按钮
      //此处是为了测试播放结束后连续播放下一首
      'click .fast_dorward':function(){
        //快进到330秒处
        _myMedia.seekTo(330000);
        console.log("fast_dorward: 330 sec");
      }

  });


  //回调的子函数
  var successCallback = function()
  {
      //这句释放资源一定要加，若没有这句会使APP卡住
      _myMedia.release();

      console.log("播放结束或停止，可以在这里继续播放下一个音频");

      //模拟播放下一首
      var url = "application/voice/创世记第1章.mp3";
      _myMedia = new Media(url, successCallback, errorCallback, statusCallback);
      _myMedia.play();

  }

  //回调的子函数
  var errorCallback = function(error)
  {
      console.log("Audio Error: " + err);
  }

  //回调的子函数
  var statusCallback = function(status)
  {
      // Media.MEDIA_NONE = 0;
      // Media.MEDIA_STARTING = 1;
      // Media.MEDIA_RUNNING = 2;
      // Media.MEDIA_PAUSED = 3;
      // Media.MEDIA_STOPPED = 4;

      console.log("Audio Status: " + status);
  }

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
