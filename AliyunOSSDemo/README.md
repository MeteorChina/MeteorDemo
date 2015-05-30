# 移动设备 - 阿里云 Aliyun OSS示例程序

Aliyun OSS Demo for Meteor on Mobile Device


## 注意

在Android下运行，需要用Eclipse手动将此Demo根目录中的"ChromeSocketsTcp.java"文件，替换掉Android工程中的"AliyunOSSDemo/.meteor/local/cordova-build/platforms/android/src/org/chromiumChrome/SocketsTcp.java"文件。

因为插件cordova:org.chromium.sockets.tcp@1.3.2在Android下有bug，无法发送大于7200字节的数据，已在1.3.4版本修正。
https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-sockets-tcp/pull/2


## 简介

- 支持Android和iOS
- 读取本地音频文件，通过阿里云OSS API上传到阿里云OSS中
- 使用包 http://plugins.cordova.io/#/package/org.chromium.sockets.tcp
- 使用包 https://github.com/apache/cordova-plugin-file/
- 使用包 https://github.com/peerlibrary/meteor-digest/


## 截图

无


## 使用的包

	$ meteor list

	autopublish                       1.0.3  Publish the entire database to all clients
	cordova:org.apache.cordova.file   1.3.3
	cordova:org.chromium.sockets.tcp  1.3.2
	insecure                          1.0.3  Allow all database writes by default
	meteor-platform                   1.2.2  Include a standard set of Meteor packages in your app
	peerlibrary:digest                0.1.3  Cryptographic digest and HMAC algorithms in Javascript for...



## 下载

下载源代码：[请戳这里](https://github.com/MeteorChina/MeteorDemo/archive/master.zip)


## 感谢

- 需要翻墙 https://developer.chrome.com/apps/sockets_tcp
- https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-sockets-tcp
- http://plugins.cordova.io/#/package/org.chromium.sockets.tcp
- https://github.com/peerlibrary/meteor-digest/
- https://github.com/apache/cordova-plugin-file
- http://stackoverflow.com/questions/11837663/nio-fail-when-writing-more-data-than-reading


若您要发表评论或提交问题，[请戳这里](https://github.com/MeteorChina/MeteorDemo/issues)

[dyh](https://github.com/dyh) 说：助人乃快乐之本！  ^_______^
