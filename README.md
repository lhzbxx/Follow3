<p align="center">
  <a href="http://www.lhzbxx.top">
    <img src="http://7xsz4e.com2.z0.glb.clouddn.com/logo.png">    
  </a>
  <br>
  <img src="http://7xsz4e.com2.z0.glb.clouddn.com/favicon.png?imageView/2/w/90">
</p>
<p align="center">
  <a href="https://gitter.im/lhzbxx/Follow3?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">
    <img src="https://badges.gitter.im/lhzbxx/follow3.svg">
  </a>
  <a href="https://follow3-slackin.herokuapp.com/">
    <img src="https://follow3-slackin.herokuapp.com/badge.svg">
  </a>
</p>
<p align="center">麻麻再也不用担心我错过直播了-计划3.0·Alpha</p>
<p align="center">
  <a href="https://github.com/lhzbxx/Follow3/issues">
    <img src="https://img.shields.io/github/issues/lhzbxx/follow3.svg" alt="">
  </a>
  <a href="https://github.com/lhzbxx/Follow3/releases">
    <img src="https://img.shields.io/github/release/lhzbxx/follow3.svg" alt="">
  </a>
  <a href="https://github.com/lhzbxx/Follow3/releases">
    <img src="https://img.shields.io/github/downloads/lhzbxx/follow3/total.svg" alt="">
  </a>
</p>
<p align="center">
  <a href="http://www.wtfpl.net/">
    <img src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-1.png" alt="">
  </a>
</p>

---
## 目标

+ 麻麻再也不用担心我错过直播了-计划3.0·Alpha
+ 时刻跟进主播状态，并通过邮件通知您！
+ 只需要一个平台，掌握所有主播的信息。

---

## APP

* 支持的平台
	* Android
	* iOS
* 下载: 

	[直达链接](http://fir.im/follow3)
	
* 二维码：

	![二维码](deploy/follow3_download_qrcode.png)

---

## 开发计划：

1. 制作精简的网页版，提供关注功能。
2. 开发APP，精准推送。

---

## 已完成

1. 对斗鱼、熊猫、战旗、全民直播平台的解析。
2. 暂时运转良好的邮件通知。
3. ...

---

## 待完成

1. 对火猫、虎牙、龙珠、Twitch平台的解析。
2. ...

---

## 已知问题

1. <del>iOS下的SearchBar存在bug.</del>稍微解决了一下，但并不完美。
2. <del>使用link打开App存在问题。</del>已经完美修正。
3. <del>ngFor和ngIf存在冲突。</del>改用后台增加接口的方案。
4. <del>iOS的Fab Button感觉怪怪的。</del>看多了就习惯了。O__O
5. <del>需要对网络通信做一个Provider，现在太乱了。</del>已经修正。
6. <del>用户的Profile需要进行更新。</del>已经修正。
7. <del>iOS的ICON需要修正。</del>
8. <del>添加一个单主播的Modal页面？</del>
9. Android端双击Back退出。
10. 取消关注后添加撤销的Toast。
11. 对邮件发送设限（不要因为Exception而一次性发太多！），添加退订链接。
12. 主播离开平台后的处理。┑(￣Д ￣)┍
13. <del>Preference选择bug。</del>
14. 通知Tab的Badge处理。

---

## 长远的计划

1. 提供流视频的直接播放。
2. 推荐您可能喜欢的主播！（⭐️）
3. 提供新的弹幕平台（仅测试）。
4. 加入好友功能？周围的人正在看什么的功能？好吧，LBS有点做腻歪了，这个先留个坑吧，如果真的有需求再做。

---

## 特性

1. 使用了之前一段时间很火的PHP7作为运行环境，然而我感觉并没有什么卵用。
2. <del>前端Vue+Materilalize</del>前端Ionic，后端Lumen，数据库MariaDB，缓存数据库Redis，进程管理器Supervisor，邮件服务器Postfix，并没有用什么很吊的新特性。
3. 正在考虑使用Docker来部署。
4. 没了。

## 更新

* 2016.4.25

    鉴于一些同学非常鄙弃邮件通知的方法，所以只好尽快赶工出APP了。由于我个人精力有限，还有一些其它好玩儿的东西想要实现，所以就只做APP了。

* 2016.4.26

	突然发现Ionic2+Angular2好像很赞的样子，但是不知道要重新填多少坑 →_→
	
* 2016.4.30

	确定加入推荐系统了！
	
* 2016.5.2

	添加了极光推送，但是Android端休眠状态下根本收不到...需要fix...
	
* 2016.5.3

	真是杯具！由于种种原因，我把lhzbxx.top的邮箱域名被QQ拉黑了 QAQ
	
	PandaTV的API似乎正在大规模改动中啊，有点方。 -> MDZZ，乱改API，刚刚找到一个临时方案来解决，结果过了一下午又改回来了，日了狗了。
	
* 2016.5.6

	昨天斗鱼炉石区似乎发生了大事。导致一些主播的信息都请求不到了 →_→ 但是我没有写这种情况的处理，所以今天凌晨开始断了一段时间服务。
	
* 2016.5.11

	最近查了一下Twitch的API，虽然经过了HTTPS加密，但是发现逻辑好像也很清晰，只是不知道有没有屏蔽这种规律抓取的行为，有时间添加一下。

* 2016.5.17

	需要苹果开发者证书啊！

	手贱使用了Git工作流，略蛋疼！

---

## 吐槽

1. 阿里云下的万网备案真是蛋疼啊，听说以前幕布是免费的？
2. 欢迎提issue！
3. 服务器真的会Crash掉的！kswapd0消耗100%CPU有木有！我再也不写这种危险的代码了，TAT。

---

## 捐赠

这个项目是完全免费的，但是制作和维护都花费了不少精力和那么一丢丢硬件成本。

所以，跪求各位土豪包养！如果您觉得这个项目不错，可以通过下面的二维码请我喝一杯咖啡。

![支付宝](http://o6xwrt3vx.bkt.clouddn.com/ali_pay.jpg?imageView/2/h/250)
![微信](http://o6xwrt3vx.bkt.clouddn.com/wechat_pay.jpg?imageView/2/h/250)

---

## 感谢

1. [You-get](https://github.com/soimort/you-get)
2. <del>[Materialize](https://github.com/Dogfalo/materialize)</del>
3. [Slackin](https://github.com/rauchg/slackin)
4. [Lumen](https://github.com/laravel/lumen)
5. <del>[Vue](https://github.com/vuejs/vue)</del>
6. [Ionic](https://github.com/driftyco/ionic)
