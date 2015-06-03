if (Meteor.isClient) {

  //接收短信的手机号码
  var _cellphone = "186xxxxxxxx";//请改为要接收短信的手机号码

  //前端显示验证码
  Session.setDefault('captcha', "bla~bla~~");

  Template.hello.helpers({
    captcha: function () {
      return Session.get('captcha');
    }
  });

  Template.hello.events({

    'click button': function () {

      Meteor.call('sendSMS', _cellphone, 
        function (error, result){ 
          //若返回值是预先约定好的"-1"，则表示发送短信失败
          if(result === "-1")
          {
            alert("发送失败！");
          }
          else
          {
            Session.set('captcha', result);
            alert("发送成功。");
          }
      });

    }
  });
}

if (Meteor.isServer) {

  // www.yunpian.com
  // 短信发送 APIKEY
  var _apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx";//请改为您的APIKEY
  //短信内容
  var _text = "";
  //验证码
  var _captcha = "";

  Meteor.startup(function () {
    //验证码
    _captcha = "523523";

    //短信内容
    _text = "【呼 声】您的验证码是" + _captcha + "。如非本人操作，请忽略本短信";
  });


  Meteor.methods({
    sendSMS: function (cellphone) {
      check(cellphone, String);
      this.unblock();

      try{
        var result = HTTP.call("POST", "http://yunpian.com/v1/sms/send.json", 
          {params: {"apikey": _apiKey, "mobile": cellphone, "text": _text}, 
          headers: {"Accept": "application/json;charset=utf-8", 
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;"}});

        console.log(result);

        //正确的返回值如下：

        // => App running at: http://localhost:3000/
        // I20150603-14:46:12.948(8)? { statusCode: 200,
        // I20150603-14:46:12.949(8)?   content: '{"code":0,"msg":"OK","result":{"count":1,"fee":1,"sid":1961708495}}',
        // I20150603-14:46:12.950(8)?   headers: 
        // I20150603-14:46:12.950(8)?    { server: 'Tengine',
        // I20150603-14:46:12.950(8)?      date: 'Wed, 03 Jun 2015 06:46:12 GMT',
        // I20150603-14:46:12.950(8)?      'content-type': 'application/json;charset=utf-8',
        // I20150603-14:46:12.950(8)?      'transfer-encoding': 'chunked',
        // I20150603-14:46:12.950(8)?      connection: 'keep-alive',
        // I20150603-14:46:12.950(8)?      'strict-transport-security': 'max-age=31536000; includeSubDomains',
        // I20150603-14:46:12.950(8)?      'x-content-type-options': 'nosniff' },
        // I20150603-14:46:12.951(8)?   data: 
        // I20150603-14:46:12.951(8)?    { code: 0,
        // I20150603-14:46:12.951(8)?      msg: 'OK',
        // I20150603-14:46:12.951(8)?      result: { count: 1, fee: 1, sid: 1961708495 } } }

        return _captcha;

      } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            // throw new Meteor.Error("error", e);

            for(var key in e) 
            {
              console.log(" - " + key + ":"+e[key]);
            } 

            return "-1";
        }

      }

  });

}
