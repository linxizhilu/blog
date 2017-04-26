# git的常用命令
以前工作是以`svn`作版本管理，现在要改成`git`进行版本管理，虽然之前一直在使用，但都是个人进行开发，现在要进行团队多人协作开发，只能恶补一下，记下`git`常用命令，想不起来的时候看一下，就豁然开朗了。
其中:`<filename>` 是你指定要操作的文件名，`<tagname>`要添加的标签名，均不需要加引号（配置邮箱，别名等操作时需要添加引号）。
## 忽略特殊的文件
`.gitignore`配置文件，忽略文件的原则是：
1. 忽略操作系统自动生成的文件，比如缩略图等。
2. 忽略编译生成的中间文件、可执行文件等，也就是如果一个文件是通过另一个文件自动生成的，那自动生成的文件就没必要放进版本库。
3. 忽略你自己的带有敏感信息的配置文件，比如存放口令的配置文件。

## 清除`.gitignor`文件添加新的项目后的缓存文件
```git
git rm -r --cached .
```
## 配置个人文件
全局的可以在`c`盘下找到`gitconfig`文件，本地的在`git`目录下的`gitconfig`文件
```git
git config --global user.name "luqiang1631@126.com" :个人邮箱，提交代码时使用，作为一个作者的标识
git config --global color.ui true ：显示带色彩
git config --global alias.<newcommand> <oldcommand> :给一个命令起一个别名，方便使用
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"  :比较好用
```
## 添加到暂存区(缓存区)的命令
```git
git add <filename>  :将制定文件添加到暂存区
git add .           :将所有文件添加到暂存区
git add -u          :只添加已提交的文件到索引
it add -f <filename>:强制添加一个文件到仓库（包括被.gitignore包含的文件）
```
## 将暂存区的文件添加到仓库
```git
git commit -m "你自己的注释" :将暂存区的文件添加到仓库，必须添加注释，以便阅读
git commit -a               :提交所有的本地修改过的并且已经添加到仓库的文件（commit all local changes in track files）
git commit --amend          :修改修改最近一次的提交
```
## 查看工作区和暂存区的状态
```git
git status             :工作区和暂存区的差异，并会显示当前在哪个分支
```
## 查看修改差异
```git
git diff                :工作区和暂存区的差异
git diff --cached       :暂存区和本地仓库之间的差异
git diff HEAD           :工作目录和仓库最版本之间的差异
git diffTool            :显示版本对比工具
```
## 版本回退
```git
git reset --hard HEAD^    :这个是回退到上一个版本状态
git reset --hard <version>:回退到该版本号所在的位置
git reset HEAD <filename> :可以把暂存区的指定文件修改撤销掉
```
## 查看提交日志
```git
git log               :查看最近的提交日志，可以使用（git log --pretty=oneline 单行查看）（git log --graph 看到分支合并图）
git log -1            :查看最后一次的提交日志
git reflog            :查看历史操作命令
```
## 撤销修改
```git
git checkout -- <filename> : 撤销修改（如果提交到暂存区，就撤销到提交暂存区后的状态，如果没有的话就是最近提交到仓库commit时的状态
```
## 删除文件
```git
git rm <filename>       :仓库删除文件
```
## 创建分支
```git
git branch <branchname>                         :创建分支
git checkout <branchname>                       :切换到当前分支
git checkout -b <branchname>                    :创建并切换到该分支
git checkout -b <branchname> origin/<branchname>:获取远程仓库分支
```
## 合并分支
```git
git merge <branchname>      :合并指定分支到当前分支（fast-forward合并）
git merge --no-ff -m "注释" :普通模式合并分支，可以看出分支合并
```
## 删除分支
```git
git branch -d <branchname> :删除分支
```
## 工作区快照
```git
git stash               :将当前分支的工作区的内容存储起来，以便区修改其它问题，修改完成之后可以恢复工作区
git stash list          :查看被存储的工作区，包括分支信息
git stash apply         :恢复工作区，但stash里的内容不删除，需使用（git stash drop）删除
git stash pop           :恢复工作区，并删除stash里的内容
```
## 初始化仓库（需配置个人信息）
```git
git init                :初始化一个本地仓库
git init --bare         :初始化一个仓库（在服务器的话最好加上--bare参数，会创建一个裸仓库，裸仓库没有工作区）
```
## 添加远程仓库
```git
git remote add origin <远程仓库地址> :添加一个远程仓库地址，以github为例(git remote add origin git@github.com:linxizhilu/blog.git)
```
## 克隆远程仓库
```git
git clone <远程仓库地址>         :克隆一个远程仓库地址，以github为例(git clone https://github.com/linxizhilu/blog.git)
```
## 显示远程仓库信息
```git
git remote                   :会显示远程仓库信息
git remote -v                ：显示拉取和推送的仓库地址信息
```
## 推送分支
```git
git push origin <branchname>      :分支推送自己的修改，可以使master、dev、test等
```
## 获取分支
```git
git pull                   ：获取远程分支，（默认为master分支）(git pull失败时需要 git branch --set-upstream dev origin/dev 将当前分支和远程分支关联起来再进行拉取)
```
## 添加标签（一般是对master分支打标签
```git
git tag <tagname>               :添加标签
git tag                         :查看标签
git show <tagname>              :查看标签信息
git tag -a <tagname> -m "test." :可以指定标签信息
```
