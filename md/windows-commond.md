# 命令行常用命令
> 自己记录下来，省得用的时候再找

## windows常用命令

``MD`` 创建目录。<br/>
`MKDIR` 创建目录。<br/>
`MODE` 配置系统设备。<br/>
`MORE` 一次显示一个结果屏幕。<br/>
`MOVE` 将文件从一个目录移到另一个目录。<br/>
`PATH` 显示或设置可执行文件的搜索路径。<br/>
`PAUSE` 暂停批文件的处理并显示消息。<br/>
`POPD` 还原 `PUSHD` 保存的当前目录的上一个值。<br/>
`PRINT` 打印文本文件。<br/>
`PROMPT` 更改 `Windows` 命令提示符。<br/>
`PUSHD` 保存当前目录，然后对其进行更改。<br/>
`RD` 删除目录。<br/>
`RECOVER` 从有问题的磁盘恢复可读信息。<br/>
`REM` 记录批文件或 `CONFIG.SYS` 中的注释。<br/>
`REN` 重命名文件。<br/>
`RENAME` 重命名文件。<br/>
`REPLACE` 替换文件。<br/>
`RMDIR` 删除目录。<br/>
`SET` 显示、设置或删除 `Windows` 环境变量。<br/>
`SETLOCAL` 开始批文件中环境更改的本地化。<br/>
`SHIFT` 更换批文件中可替换参数的位置。<br/>
`SORT` 对输入进行分类。<br/>
`START` 启动另一个窗口来运行指定的程序或命令。<br/>
`SUBST` 将路径跟一个驱动器号关联。<br/>
`TIME` 显示或设置系统时间。<br/>
`TITLE` 设置 `CMD.EXE` 会话的窗口标题。<br/>
`TREE` 以图形模式显示驱动器或路径的目录结构。<br/>
`TYPE` 显示文本文件的内容。<br/>
`VER` 显示 `Windows` 版本。<br/>
`VERIFY` 告诉 `Windows` 是否验证文件是否已正确写入磁盘。<br/>
`VOL` 显示磁盘卷标和序列号。<br/>
`XCOPY` 复制文件和目录树
`AT` 计划在计算机上运行的命令和程序。<br/>
`ATTRIB` 显示或更改文件属性。<br/>
`BREAK` 设置或清除扩展式 `CTRL`+`C` 检查。<br/>
`CACLS` 显示或修改文件的访问控制列表(`ACLs`)。<br/>
`CALL` 从另一个批处理程序调用这一个。<br/>
`CD` 显示当前目录的名称或将其更改。<br/>
`CHCP` 显示或设置活动代码页数。<br/>
`CHDIR` 显示当前目录的名称或将其更改。<br/>
`CHKDSK` 检查磁盘并显示状态报告。<br/>
`CHKNTFS` 显示或修改启动时间磁盘检查。<br/>
`CLS` 清除屏幕。<br/>
`CMD` 打开另一个 `Windows` 命令解释程序窗口。<br/>
`COLOR` 设置默认控制台前景和背景颜色。<br/>
`COMP` 比较两个或两套文件的内容。<br/>
`COMPACT` 显示或更改 `NTFS` 分区上文件的压缩。<br/>
`CONVERT` 将 `FAT` 卷转换成 `NTFS`。<br/>您不能转换当前驱动器。<br/>
`COPY` 将至少一个文件复制到另一个位置。<br/>
`DATE` 显示或设置日期。<br/>

## linux下常用shell命令
```javascript
`ls`　　            显示文件或目录。<br/>
     `-l`           列出文件详细信息`l`(`list`)。<br/>
     `-a`           列出当前目录下所有文件及目录，包括隐藏的`a`(`all`)。<br/>
`mkdir`             创建目录。<br/>
     `-p`           创建目录，若无父目录，则创建`p`(`parent`)。<br/>
`cd`                切换目录。<br/>
`touch`             创建空文件。<br/>
`echo`              创建带有内容的文件。<br/>
`cat`               查看文件内容。<br/>
`cp`                拷贝。<br/>
`mv`                移动或重命名。<br/>
`rm`                删除文件。<br/>
     `-r`           递归删除，可删除子目录及文件。<br/>
     `-f`           强制删除。<br/>
`find`              在文件系统中搜索某文件。<br/>
`wc`                统计文本中行数、字数、字符数。<br/>
`grep`              在文本文件中查找某个字符串。<br/>
`rmdir`             删除空目录。<br/>
`tree`              树形结构显示目录，需要安装`tree`包。<br/>
`pwd`               显示当前目录。<br/>
`ln`                创建链接文件。<br/>
`more`、`less`        分页显示文本文件内容。<br/>
`head`、`tail`        显示文件头、尾内容。<br/>
`ctrl+alt+F1`       命令行全屏模式。<br/>
```
## linux系统管理命令
```javascript
stat              显示指定文件的详细信息，比ls更详细
who               显示在线登陆用户
whoami            显示当前操作用户
hostname          显示主机名
uname             显示系统信息
top               动态显示当前耗费资源最多进程信息
ps                显示瞬间进程状态 ps -aux
du                查看目录大小 du -h /home带有单位显示目录信息
df                查看磁盘大小 df -h 带有单位显示磁盘信息
ifconfig          查看网络情况
ping              测试网络连通
netstat           显示网络状态信息
man               命令不会用了，找男人  如：man ls
clear             清屏
alias             对命令重命名 如：alias showmeit="ps -aux" ，另外解除使用unaliax showmeit
kill              杀死进程，可以先用ps 或 top命令查看进程的id，然后再用kill命令杀死进程。

```
