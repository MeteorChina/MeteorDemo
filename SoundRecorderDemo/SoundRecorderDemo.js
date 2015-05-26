if (Meteor.isClient) {

    Template.hello.helpers({
    });

    //录音对象
    var _voiceRecorder;
    //音频文件名
    var _amrFileName;

    Meteor.startup(function () {
        //录音文件名
        _amrFileName =  "test1234.amr";
    });


    Template.hello.events({
        'click .start':function(){
          //开始录音

          //如果存在此对象，则先释放资源
          if(_voiceRecorder)
          {
              _voiceRecorder.release();
          }

          //实例化录音对象
          _voiceRecorder = new Voice(_amrFileName, successCallback, errorCallback, statusCallback);

          //--------路径--------
          //iOS将存储在"/tmp/test1234.amr"
          //Android将存储在"/storage/sdcard0/test1234.amr"
          _voiceRecorder.startRecord();

          alert('开始录音');
        },
        'click .stop':function(){
          //结束录音
          _voiceRecorder.stopRecord();

          alert('录音结束');
        },
        'click .play':function(){
          //播放录音
          //如果存在此对象，则先释放资源
          if(_voiceRecorder)
          {
              _voiceRecorder.release();
          }

          _voiceRecorder = new Voice(_amrFileName, successCallback, errorCallback, statusCallback);
          _voiceRecorder.play();

          alert('播放录音');
        }
    });


    //成功回调
    var successCallback = function()
    {
    }

    //错误回调
    var errorCallback = function(errorCode)
    {
        console.log('errorCode: ');

        for(var key in errorCode) 
        {
            console.log(key + ":" + errorCode[key]);
        }
    }

    //状态回调
    var statusCallback = function(statusCode)
    {
        // Voice.VOICE_NONE = 0;
        // Voice.VOICE_STARTING = 1;
        // Voice.VOICE_RUNNING = 2;
        // Voice.VOICE_PAUSED = 3;
        // Voice.VOICE_STOPPED = 4;
        console.log('statusCode: ' + statusCode);

        switch(statusCode)
        {
          case Voice.VOICE_NONE:
              console.log('VOICE_NONE');
              break;
          case Voice.VOICE_STARTING:
              console.log('VOICE_STARTING');
              break;
          case Voice.VOICE_RUNNING:
              console.log('VOICE_RUNNING');
              break;
          case Voice.VOICE_PAUSED:
              console.log('VOICE_PAUSED');
              break;
          case Voice.VOICE_STOPPED:
              console.log('VOICE_STOPPED');
              //录音结束，释放资源
              _voiceRecorder.release();
              alert('录音或播放结束，释放资源');
              break;
        }

    }

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
