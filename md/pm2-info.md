# pm2知识简介

## pm2 是一个带有负载均衡功能的`Node`应用的进程管理器.

pm2经常用来做为node服务器的进程管理工具，可以方便的进行进程的启动停止及监控等工作。

## 主要特性

1. 内奸负载均衡 ([基于node的cluster模块](https://nodejs.org/api/cluster.html "node的cluster模块"))
2. 0秒停机重载(我理解也是因为`cluster`的多进程管理，可以进行进程间的切换).
3. 停止不稳定的进程(避免无限循环)
4. 控制台检测(控制台信息显示)
5. 远程控制和实时的接口API ( Nodejs 模块,允许和PM2进程管理器交互 )

## 安装

 `npm install -g pm2`

## 用法
```javascript
$ npm install pm2 -g    			# 命令行安装 pm2
$ pm2 start app.js -i 4 			#后台运行pm2，启动4个app.js
                                	# 也可以把'max' 参数传递给 start
                                	# 正确的进程数目依赖于Cpu的核心数目
$ pm2 start app.js --name my-api	# 命名进程
$ pm2 list               			# 显示所有进程状态
$ pm2 monit              			# 监视所有进程
$ pm2 logs               			#  显示所有进程日志
$ pm2 stop all           			# 停止所有进程
$ pm2 restart all        			# 重启所有进程
$ pm2 reload all         			# 0秒停机重载进程 (用于 NETWORKED 进程)
$ pm2 stop 0             			# 停止指定的进程
$ pm2 restart 0          			# 重启指定的进程
$ pm2 startup            			# 产生 init 脚本 保持进程活着
$ pm2 web                			# 运行健壮的 computer API endpoint (http://localhost:9615)
$ pm2 delete 0           			# 杀死指定的进程
$ pm2 delete all         			# 杀死全部进程
```
可以通过pm2命令查看pm2所有命令的使用方式

↓启动一个命名为`api`的服务器，`app.js`为服务器入口,并开启最大的CPU数量

```javascript
pm2 start app.js -i 0 --name "api"
```

↓列出由pm2管理的所有进程信息，还会显示一个进程会被启动多少次，因为没处理的异常。
```javascript
pm2 list
```
[pm2 list]: https://github.com/linxizhilu/blog/edit/master/images/pm2list.jpg "pm2 list"
<img src="images/pm2list.jpg" style="width:100%;max-width: 100%;">
↓监视每个node进程的CPU和内存的使用情况。
```javascript
pm2 monit
```
[pm2 monit]: https://github.com/linxizhilu/blog/edit/master/images/pm2monit.jpg "pm2 monit"
<img src="images/pm2monit.jpg" style="width:100%;max-width: 100%;">
