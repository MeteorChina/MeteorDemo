# 移动设备 - 操作本地文件示例程序

Local File Operation Demo for Meteor on Mobile Device


## 简介

- 可以播放www目录下的文件
- 可以播放documents目录下的文件
- 支持锁屏后台播放，使用包：cordova:de.appplant.cordova.plugin.background-mode
- 服务器端代码更新后不会中断播放，待APP重启时才会更新APP，使用包：mdg:reload-on-resume


## 注意

### iOS路径

- 播放www目录下的文件 "application/voice/1-1.mp3"

- 播放documents目录下的文件 "documents://voice/1-1.mp3"


### Android路径

- 尽量使用绝对路径

- 播放www目录下的文件 cordova.file.applicationDirectory + "www/application/voice/1-1.mp3"

- 音频等媒体文件尽量不要使用中文路径及文件名，因为在eclipse开发环境下，/assets/目录中不支持中文。



## 截图

![image](screenshot2.png)

![image](screenshot1.png)


## 使用的包

	$ meteor list

	autopublish                                         1.0.3  Publish the entire database to all clients
	cordova:de.appplant.cordova.plugin.background-mode  0.6.4
	cordova:org.apache.cordova.file                     1.3.3
	cordova:org.apache.cordova.media                    0.2.16
	insecure                                            1.0.3  Allow all database writes by default
	mdg:reload-on-resume                                1.0.4  On Cordova, only allow the app to reload when the app is resumed.
	meteor-platform                                     1.2.2  Include a standard set of Meteor packages in your app


## 下载

下载源代码：[请戳这里](https://github.com/MeteorChina/MeteorDemo/archive/master.zip)


## 感谢

- http://plugins.cordova.io/#/package/org.apache.cordova.media
- http://www.telerik.com/forums/no-sound-played-by-device-using-cordova's-media-object-
- https://github.com/katzer/cordova-plugin-background-mode
- https://atmospherejs.com/mdg/reload-on-resume
- https://github.com/apache/cordova-plugin-file


若您要发表评论或提交问题，[请戳这里](https://github.com/MeteorChina/MeteorDemo/issues)

[dyh](https://github.com/dyh) 说：助人乃快乐之本！  ^_______^