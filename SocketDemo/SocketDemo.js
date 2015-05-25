if (Meteor.isClient) {

  Template.hello.helpers({
  });

  Template.hello.events({

      'click .socket':function(){

        //创建socket的tcp连接
        chrome.sockets.tcp.create(socketCreateCallback);

      }
  });


    //socket的id，用于判断唯一的socket对象
    var _socketID = -1;

    //创建socket的回调
    var socketCreateCallback = function(createInfo) {

        _socketID = createInfo.socketId;
        console.log("Socket ID: " + _socketID);

        //连接www.163.com的80端口
        //需要DNS解析
        chrome.sockets.tcp.connect(_socketID, "weather.com.cn", 80, socketConnectCallback)

    }


    //连接socket回调
    var socketConnectCallback = function(result) {
        if(result >= 0)
        {
            //注册事件，接收信息事件
            chrome.sockets.tcp.onReceive.addListener(onReceiveCallback);

            //注册事件，接收到错误信息事件
            chrome.sockets.tcp.onReceiveError.addListener(function(info){
                console.log("socketId: " + info.socketId);
                console.log("error resultCode: " + info.resultCode);
            });


            //要发送的http头内容，用于获得网站首页html
            // GET / HTTP/1.1
            var httpHeader = "GET /weather1d/101070101.shtml\n\n";
            var socketBuffer = new ArrayBuffer(httpHeader.length);
            var socketBufferView = new Uint8Array(socketBuffer);

            //转换成arraybuffer后发送给服务器
            for (var i=0; i<httpHeader.length; i++) {
                socketBufferView[i] = httpHeader.charCodeAt(i);
            }

            //socket send
            chrome.sockets.tcp.send(_socketID, socketBuffer, socketSendCallback)
        }
        else
        {
          alert("connect error: " + result);
        }

    }


    //接收服务器发来的数据
    var onReceiveCallback = function(info){
        console.log("onReceive socketId: " + info.socketId);

        //接收到的信息是ArrayBuffer类型，下面转换成string用于显示
        // alert("onReceive: " + ab2str_arraymanipulation(info.data));
        
        console.log(ab2str_arraymanipulation(info.data));
        //获取数据后，在这里做下一步操作

    }


    //发送数据的回调
    var socketSendCallback = function(sendInfo) {
        console.log("sent resultCode: " + sendInfo.resultCode);
        console.log("bytesSent: " + sendInfo.bytesSent);
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
