if (Meteor.isClient) {

  // 注意：对于阿里云OSS API有困惑的话请参照PDF格式完整版的OSS API文档
  // http://docs-aliyun-com-cn-b.oss-cn-hangzhou.aliyuncs.com/oss/pdf/oss_product-documentation.pdf

  // 注意：对于http协议有困惑的话请参照rfc2616
  // http://www.ietf.org/rfc/rfc2616.txt


  //----------------运行前，需要修改的参数----------------

  //阿里云OSS访问密钥
  //Authorization
  var _accessKeyID = "bla~~bla~~bla~~";
  var _accessKeySecret = "bla~~bla~~bla~~";

  //修改为自己的bucket名称
  var _bucketName = "crying";

  //文件名称
  var _fileName = "test1234.amr";
  
  //文件类型
  //Content-Type
  var _contentType = "audio/amr";

  //OSS 服务器
  var _host = _bucketName+ ".oss-cn-hangzhou.aliyuncs.com";

  //----------------------------------------------


  //本地设备上的amr文件路径
  var _localAmrFilePath;

  //Verb
  //http动作
  var _verb = "";

  //Date
  var _date = "";


  var _authorization = "";
  //_verb+"\n\n"+_contentType+"\n" + _date+"\n"+_filePath;

  //Content-Length
  var _contentLength = -1;

  //文件路径
  var _filePath = "";


  //文件 ArrayBuffer
  var _fileData;


  //socket的id，用于判断唯一的socket对象
  var _socketID = -1;


  Meteor.startup(function () {

      //注意路径
      //本地设备上的amr文件路径
      //-------------iOS-------------
      //播放 www/application/ 目录下的文件
      _localAmrFilePath =  cordova.file.applicationDirectory + "www/application/" + _fileName;

      //-------------Android-------------
      //注意：需要手动拷贝test1234.amr到存储卡 "/storage/sdcard0/" 目录
      
      //播放 /storage/sdcard0/ 目录下的文件
      // _localAmrFilePath =  cordova.file.externalRootDirectory + _fileName;

      console.log("loading file: " + _localAmrFilePath);


      //注册事件，接收信息事件
      chrome.sockets.tcp.onReceive.addListener(onReceiveCallback);

      //注册事件，接收到错误信息事件
      chrome.sockets.tcp.onReceiveError.addListener(onReceiveErrorCallback);


  });


  Template.hello.helpers({
  });


  Template.hello.events({

      'click .head_object':function(){
          //Head Object只返回某个Object的meta信息，不返回文件内容

          //Bucket名称
          _filePath = "/"+_bucketName+"/"+_fileName;


          //创建socket
          //是否已经有socket对象
          if(_socketID === -1)
          {
            //没创建过socket
            //创建socket的tcp连接
            chrome.sockets.tcp.create(socketHeadObjectCreateCallback);
          }
          else
          {
            //先断开连接，再连接
            chrome.sockets.tcp.disconnect(_socketID, function() {
                console.log('已断开原有连接，SocketID：'+ _socketID +'，准备建立新的连接');
                chrome.sockets.tcp.connect(_socketID, _host, 80, socketHeadObjectConnectCallback);
            });

          }

      },
      'click .put_object':function(){
        //Put Object用于上传文件

        //读取文件内容
        window.resolveLocalFileSystemURL(_localAmrFilePath, gotFile, fail);
      }
  });


  //----------------------获取文件头信息开始---------------------------

  //创建socket的回调
  var socketHeadObjectCreateCallback = function(createInfo) {

      _socketID = createInfo.socketId;

      //连接_host的80端口
      chrome.sockets.tcp.connect(_socketID, _host, 80, socketHeadObjectConnectCallback);

  }

  //连接socket回调
  var socketHeadObjectConnectCallback = function(result) {

      if(result >= 0)
      {

          console.log('ConnectCallbackResult: ' + result);



          //http动作
          _verb = "HEAD";
          //时间
          _date = (new Date()).toGMTString();
          //需要验证的字符串
          _authorization = _verb+"\n\n\n" + _date+"\n"+_filePath;
          // _authorization = _verb+"\n\n"+_contentType+"\n" + _date+"\n"+_filePath;


          console.log('_authorization: ' + _authorization);


          //sha加密
          var mac = new Digest.HMAC_SHA1();
          mac.setKey(_accessKeySecret);
          mac.update(_authorization);
          //加密后的arraybuffer类型数据
          var abHash = mac.finalize();
          //转换成byte数组
          var bytesHash = ab2bytes(abHash);
          //进行base64编码
          var strSignature = base64_encode(String.fromCharCode.apply(null, bytesHash));

          // 要发送的http信息
          // 最下面两个空行，代表 \n\n 
          // 切记最后要发送“\n\n”来结束

          // HEAD /test1234.amr HTTP/1.1
          // Host: crying.oss-cn-hangzhou.aliyuncs.com
          // Date: Fri, 24 Feb 2012 06:03:28 GMT
          // Authorization: OSS qn6qrsqxo2bawuky~bla~bla:kZbYNv83cobc10+dcG~bla~bla=
          // 
          // 

          var strHttpHeader = _verb+" /"+_fileName+" HTTP/1.1\n"+ 
          "Host: "+_host+"\n" +
          "Date: "+_date+"\n"+
          "Authorization: OSS "+_accessKeyID+":"+strSignature+"\n\n";


          //将要通过socket发送的ArrayBuffer数据
          var length1 = strHttpHeader.length;

          var socketBuffer = new ArrayBuffer(length1);
          //通过BufferView对此arraybuffer进行赋值
          var socketBufferView = new Uint8Array(socketBuffer);

          //写入header信息
          for (var i=0; i<length1; i++) {
              socketBufferView[i] = strHttpHeader.charCodeAt(i);
          }

          //将socketBuffer发送给OSS
          //socket send
          chrome.sockets.tcp.send(_socketID, socketBuffer, socketHeadObjectSendCallback);
      }
      else
      {
        alert("connect error: " + result);
      }

  }



  //发送数据的回调
  var socketHeadObjectSendCallback = function(sendInfo) {

      console.log("sent resultCode: " + sendInfo.resultCode);
      console.log("bytesSent: " + sendInfo.bytesSent);
  }

  //----------------------获取文件头信息结束----------------------



  //----------------------上传文件开始----------------------

  function gotFile(fileEntry) {


    fileEntry.file(function(file) {

        //上传文件

        _fileName = file.name;
        //Bucket名称
        _filePath = "/"+_bucketName+"/"+file.name;

        //文件尺寸
        _contentLength = file.size;

        //读取文件的reader
        var reader = new FileReader();

        console.log('reader');

        reader.onloadend = function(e) {
            console.log('reader.onloadend');

              //由arraybuffer转换成byte[]
              _fileData = new Uint8Array(this.result);

              //创建socket

              //是否已经有socket对象
              if(_socketID === -1)
              {
                //没创建过socket
                //创建socket的tcp连接
                chrome.sockets.tcp.create(socketPutObjectCreateCallback);
              }
              else
              {
                //先断开连接，再连接
                chrome.sockets.tcp.disconnect(_socketID, function() {
                    console.log('已断开原有连接，SocketID：'+ _socketID +'，准备建立新的连接');
                    chrome.sockets.tcp.connect(_socketID, _host, 80, socketPutObjectConnectCallback);
                });
              }

        };

        //读取
        reader.readAsArrayBuffer(file);

      });

  }

  function fail(e) {
    alert("got file error: " + _fileName);
    for(var key in e) 
    {
      alert(key + ":"+e[key]); // f,s 
    }
  }

  //创建socket的回调
  var socketPutObjectCreateCallback = function(createInfo) {

      _socketID = createInfo.socketId;

      //连接_host的80端口
      chrome.sockets.tcp.connect(_socketID, _host, 80, socketPutObjectConnectCallback);
  }

  //连接socket回调
  var socketPutObjectConnectCallback = function(result) {

      if(result >= 0)
      {

          console.log('ConnectCallbackResult: ' + result);

          //http动作
          _verb = "PUT";
          //时间
          _date = (new Date()).toGMTString();
          //需要验证的字符串
          _authorization = _verb+"\n\n"+_contentType+"\n" + _date+"\n"+_filePath;


          //sha加密
          var mac = new Digest.HMAC_SHA1();
          mac.setKey(_accessKeySecret);
          mac.update(_authorization);
          //加密后的arraybuffer类型数据
          var abHash = mac.finalize();
          //转换成byte数组
          var bytesHash = ab2bytes(abHash);
          //进行base64编码
          var strSignature = base64_encode(String.fromCharCode.apply(null, bytesHash));


          // 最下面两个空行，代表 \n\n 
          // 切记最后要发送“\n\n”来结束

          // PUT /test1234.amr HTTP/1.1
          // Content-Length: 344606
          // Content-Type: audio/wav
          // Host: crying.oss-cn-hangzhou.aliyuncs.com
          // Date: Fri, 24 Feb 2012 06:03:28 GMT
          // Authorization: OSS qn6qrsqxo2bawuky3otfjgyc:kZbYNv83cobc10+dcGKw5x2PRrk=
          // 
          // [344606 bytes of object data]
          // 
          // 

          var strHttpHeader = _verb+" /"+_fileName+" HTTP/1.1\n"+ 
          "Content-Length: "+_contentLength+"\n" +
          "Content-Type: "+_contentType+"\n" +
          "Host: "+_host+"\n" +
          "Date: "+_date+"\n"+
          "Authorization: OSS "+_accessKeyID+":"+strSignature+"\n\n";

          console.log(strHttpHeader);

          //将要通过socket发送的ArrayBuffer数据
          var length1 = strHttpHeader.length;
          var length2 = _fileData.length;

          var socketBuffer = new ArrayBuffer(length1 + length2);
          //通过BufferView对此arraybuffer进行赋值
          var socketBufferView = new Uint8Array(socketBuffer);


          //写入header信息
          for (var i=0; i<length1; i++) {
              socketBufferView[i] = strHttpHeader.charCodeAt(i);
          }

          //写入文件数据
          for (var i=0; i<length2; i++) {
              socketBufferView[length1 + i] = _fileData[i];
          }

          // console.log('socketBuffer.length: ' + socketBuffer.length);

          //将socketBuffer发送给OSS
          //socket send

          console.log('byteLength: ' + socketBuffer.byteLength);

          chrome.sockets.tcp.send(_socketID, socketBuffer, socketPutObjectSendCallback);

      }
      else
      {
        alert("connect error: " + result);
      }

  }


  //发送数据的回调
  var socketPutObjectSendCallback = function(sendInfo) {

      console.log("sent resultCode: " + sendInfo.resultCode);
      console.log("bytesSent: " + sendInfo.bytesSent);
  }

  //----------------------上传文件结束----------------------

  //接收服务器发来的数据
  var onReceiveCallback = function(info){
      console.log("onReceive socketId: " + info.socketId);
      //接收到的信息是ArrayBuffer类型，下面转换成string用于显示
      var strResult = ab2str_arraymanipulation(info.data);
      console.log(strResult);
      //获取数据后，在这里做下一步操作


  }

  var onReceiveErrorCallback = function(info){
      console.log("socketId: " + info.socketId);
      console.log("error resultCode: " + info.resultCode);
  }



  //类型转换函数
  //base64编码
  function base64_encode(str){
      var c1, c2, c3;
      var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";                
      var i = 0, len= str.length, string = '';

      while (i < len){
              c1 = str.charCodeAt(i++) & 0xff;
              if (i == len){
                      string += base64EncodeChars.charAt(c1 >> 2);
                      string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                      string += "==";
                      break;
              }
              c2 = str.charCodeAt(i++);
              if (i == len){
                      string += base64EncodeChars.charAt(c1 >> 2);
                      string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                      string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                      string += "=";
                      break;
              }
              c3 = str.charCodeAt(i++);
              string += base64EncodeChars.charAt(c1 >> 2);
              string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
              string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
              string += base64EncodeChars.charAt(c3 & 0x3F)
      }
              return string;
  }


  var ab2bytes = function(buf) {
    var bufView = new Uint8Array(buf);
    // var unis = [];
    var unis = new Array();
    for (var i = 0; i < bufView.length; i++) {

        // console.log(bufView[i]+"\n");
        unis.push(bufView[i]);
    }
    return unis;
  }

  var str2ab_arraymanipulation = function(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  //arraybuffer转string函数
  var ab2str_arraymanipulation = function(buf) {
      var bufView = new Uint8Array(buf);
      var unis = [];
      for (var i = 0; i < bufView.length; i++) {
          unis.push(bufView[i]);
      }
      return String.fromCharCode.apply(null, unis);
  }

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
