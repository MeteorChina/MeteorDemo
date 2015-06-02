if (Meteor.isClient) {

  Template.hello.helpers({
  });

  Template.hello.events({

      'click .link':function(){
          // _self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
          // _blank: Opens in the InAppBrowser.
          // _system: 使用设备系统浏览器
          var ref = window.open('http://d1.elijah.cn/donate/donate.html', '_system', 'location=yes');
      }
      
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
