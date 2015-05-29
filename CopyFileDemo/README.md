# 移动设备 - 文件拷贝示例程序

Copying File Demo for Meteor on Mobile Device


## 注意

- 本示例暂时只支持iOS
- 本示例暂时不支持Android
- 因为org.apache.cordova.file@1.3.3有bug：https://issues.apache.org/jira/browse/CB-6428
- 新版本的cordova-plugin-file@2.0.0，暂时无法引用到meteor中：https://forums.meteor.com/t/how-to-add-cordova-plugin-file-ver-2-0-0-to-my-meteor-project-notice-it-is-not-org-apache-cordova-file/4821/1
- 待Meteor支持后，会及时更新



## 简介

- 目前只支持iOS
- 将文件 /www/application/1-1.mp3 拷贝到 /Documents/1-1.mp3
- 使用包 https://github.com/apache/cordova-plugin-file/


## 错误代码

	Code	Constant
	1	NOT_FOUND_ERR
	2	SECURITY_ERR
	3	ABORT_ERR
	4	NOT_READABLE_ERR
	5	ENCODING_ERR
	6	NO_MODIFICATION_ALLOWED_ERR
	7	INVALID_STATE_ERR
	8	SYNTAX_ERR
	9	INVALID_MODIFICATION_ERR
	10	QUOTA_EXCEEDED_ERR
	11	TYPE_MISMATCH_ERR
	12	PATH_EXISTS_ERR



## 截图

无


## 使用的包

	$ meteor list

	autopublish                      1.0.3  Publish the entire database to all cl...
	cordova:org.apache.cordova.file  1.3.3
	insecure                         1.0.3  Allow all database writes by default
	meteor-platform                  1.2.2  Include a standard set of Meteor pack...



## 下载

下载源代码：[请戳这里](https://github.com/MeteorChina/MeteorDemo/archive/master.zip)


## 感谢

- https://issues.apache.org/jira/browse/CB-6428
- http://stackoverflow.com/questions/10989523/phonegap-file-copy-error-code-1
- https://github.com/apache/cordova-plugin-file
- http://plugins.cordova.io/#/package/org.apache.cordova.file
- http://cordova.apache.org/announcements/2015/04/21/plugins-release-and-move-to-npm.html
- http://www.html5rocks.com/en/tutorials/file/filesystem/


若您要发表评论或提交问题，[请戳这里](https://github.com/MeteorChina/MeteorDemo/issues)

[dyh](https://github.com/dyh) 说：助人乃快乐之本！  ^_______^
