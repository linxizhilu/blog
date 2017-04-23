# 一些平时工作常用的小积累

## vi编辑器保存及退出命令
```javascript
:w   //保存文件但不退出vi
:w file //将修改另外保存到file中，不退出vi
:w!   //强制保存，不推出vi
:wq  //保存文件并退出vi
:wq! //强制保存文件，并退出vi
:q  //不保存文件，退出vi
:q! //不保存文件，强制退出vi
:e! //放弃所有修改，从上次保存文件开始再编辑
```
## jenkins启动停止
1. 启动`Jenkins`
> step1：进入到`Jenkins`的`war`包所在的目录如果是`win7`及以上版本，直接打开`Jenkins`的`war`包所在的目录，在地址栏敲`cmd`，回车。
<br/>
> step2：`java -jar jenkins.war`(调用里面的这个`war`包，如果你的`wa`r包名字不是`Jenkins.war`，请用你的`war`包名字，不可生搬硬套)

2. 启动`Jenkins`服务
　　`net start jenkins`  （注：如果`Jenkins`曾经启动过，启动服务不需要进入到某个目录）
3. 停止`Jenkins`服务
　　`net stop jenkins`
