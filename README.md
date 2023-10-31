# 地府管理系统
一套完整的地府管理系统，包括整个后台管理系统，生死簿查询导出，以及敲木鱼加功德功能，后端使用`node+mysql+express`技术栈，前端技术栈使用`Vue+elementUI`，多用户多权限系统
<br><br>
***为避免种种现实因素导致的问题，此地府管理系统作业流程并非真实（广为流传的说法）流程，例如传说中的望乡台，三生石都未曾体现，只是在整体流程和题材上参考***
<br><br>
## 目录
- [更新日志](#更新日志)
- [项目简介](#项目简介)
- [系统搭建运行](#系统搭建运行)
  * [1. 后端api搭建](#1-后端api搭建)
    + [a. 导入数据库](#a-导入数据库)
    + [b. 配置数据库](#b-配置数据库)
    + [c.启动api](#c启动api)
  * [2. user用户端搭建](#2-user用户端搭建)
    + [a.配置api地址](#a配置api地址)
    + [b.启动项目](#b启动项目)
  * [3.管理后台搭建运行](#3管理后台搭建运行)
    + [a.配置api接口地址](#a配置api接口地址)
    + [b.运行项目](#b运行项目)
- [截图预览](#截图预览)
## 更新日志
## 2023-10-31
 -- 修复管理员权限会被重置为NaN报错的情况<br>
 -- 添加测试数据，`api/test.sql`
## 2023-06-24
 -- 修复敲木鱼页面在开启自动后直接返回报错问题<br>
 -- 添加测试数据，`api/test.sql`

# 项目简介
```
此项目包含三部分，包括后端api接口，前端管理后台，前端用户体验端
```
整体功能包括：数据统计预览、生死簿管理、勾魂使者、勾魂管理、阎王殿审判、审判记录、十八层地狱、设备管理、六道轮回、设备管理、汇款、汇款管理、角色设置、权限管理、管理员管理以及系统设置
![管理后台首页](https://github.com/moyuc1966/netherworld-console/blob/main/images/admin-index.png "管理后台首页") 

**功能流程** 添加生死簿数据，会包含此人各种数据，包括姓名出生死亡日期和地址，阴德阳德，命中包含的财富，死亡类型，死因，此人这一生的描述，属性描述，婚姻情况，死后情况等等完整数据，等死亡日期到之后会被添加到待勾魂列表，等待勾魂使者抓捕入府，之后交由审判官审判，根据生平赏罚，处理结果包括重新打入轮回，打入十八层地狱，在世中和敲木鱼加功德<br><br>
# 系统搭建运行
```
运行环境准备：
nodeJS -v  16.15.0
mysql -V   8.0.28
```
运行顺序：api->user->admin
## 1. 后端api搭建
### a. 导入数据库
新建数据库`afterlifedb`，然后导入或执行`api/afterlifedb.sql`中的SQL，执行成功后完成数据库的导入
### b. 配置数据库
打开`api/link/config.js`填写数据库链接信息
```javascript
let config = {
    host: 'localhost',  // 数据库地址，默认localhost
    user: '',  //  数据库账号
    password: '', // 数据库密码
    database: 'afterlifedb', //数据库名，不建议更改
    timezone: "SYSTEM", 
    connectionLimit: 10 
}
```
### c.启动api
回到`api`目录，在此处打开命令窗口，安装依赖
```
npm i
```
启动项目
```
node index.js
```
当看到`Service started successfully, running on http://localhost:3000`就表示项目启动成功
尝试请求（访问）`http://127.0.0.1:3000/api/user/gettempauth`看能否返回授权成功字样，如果不能，请检查数据库的导入


## 2. user用户端搭建
### a.配置api地址
打开`user/src/main.js`文件，此处有三个地址需要填写
```javascript
Vue.prototype.apiUrl = 'http://localhost:3000' //api接口地址，不携带/

Vue.prototype.adminUrl = 'http://localhost:8081' //后台管理系统地址

axios.defaults.baseURL = 'http://localhost:3000/'; //api接口地址，注意末尾携带/
```
如果是在本地运行，检查端口正确后默认就好，后台管理系统此时还未搭建，如果8081端口没有被占用，那么后台管理系统地址就是`http://localhost:8081`，如果8081端口被占用则运行在`http://localhost:8082`端口，依次类推
检查某端口是否被占用，在cmd执行如下命令，如果返回内容为空则表示未被占用
```
netstat -ano|findstr "8081"
```
### b.启动项目
回到`api`目录，在此处打开命令窗口，安装依赖
```
npm i
```
启动项目，如果只是本地预览，执行如下命令直接运行即可，运行完毕后访问输出的`App running at:`中的地址即可
```
npm run serve
```
如果是需要打包发布，按如下流程完成，否则请直接跳过此内容到[3. 管理后台搭建](#3管理后台搭建运行)<br>
打包
```
npm run build
```
生成文件在`user\dist`文件夹，其文件夹内为已经打包好的内容<br><br>
使打包好内容在本地跑起来

(1) 按照express创建出基本的结构
```
mkdir myapp
cd myapp
npm init
```
package.json会被创建出来

(2) 安装express
```
npm install express --save
```
会创建 node_modules 

(3)同级目录下创建`index.js`文件和www文件夹，其中`index.js`中写入
```javascript
const express = require('express')
const app = express()
 
app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static('./www'))
 
app.listen(3010, () => console.log('Example app listening on port 3010!'))
```
(4) `npm run build`之后将你打包出的文件目录放到`www`文件夹下，如打包出来的文件目录为dist,dist里面有index.html和page文件夹，page文件夹是所有的打包之后的文件

(5) 加路由访问`localhost:3010/index.html`即可访问到你打包出的页面了

如果其他电脑也需要访问，将localhost换成本地的ip地址就OK

## 3.管理后台搭建运行
### a.配置api接口地址
打开`admin/src/main.js`文件，此处有三个地址需要填写
```javascript
Vue.prototype.apiUrl = 'http://localhost:3000' //api接口地址，不携带/

Vue.prototype.adminUrl = 'http://localhost:8080' //user用户端搭建得到的地址

axios.defaults.baseURL = 'http://localhost:3000/'; //api接口地址，注意末尾携带/
```
如果是在本地运行，检查端口正确后默认就好
### b.运行项目
回到`admin`目录，在此处打开命令窗口，安装依赖
```
npm i
```
启动项目，如果只是本地预览，执行如下命令直接运行即可，运行完毕后访问输出的`App running at:`中的地址即可
```
npm run serve
```
如果是需要打包发布，请参考上文中[打包运行流程](#b启动项目)<br><br>
***后台管理最高管理员默认账号密码是admin，123456***
<br><br>至此项目搭建启动完成

# 截图预览
![管理后台首页](https://github.com/moyuc1966/netherworld-console/blob/main/images/admin-index.png "管理后台首页") 
![生死簿数据管理](https://github.com/moyuc1966/netherworld-console/blob/main/images/admin-lifebook.png "生死簿数据管理") 
![后台权限对比](https://github.com/moyuc1966/netherworld-console/blob/main/images/admin-role.png "后台权限对比") 
![轮回转盘](https://github.com/moyuc1966/netherworld-console/blob/main/images/admin-samsara.png "轮回转盘") 
![阎王殿审判](https://github.com/moyuc1966/netherworld-console/blob/main/images/admin-trial.png "阎王殿审判")
![用户端首页](https://github.com/moyuc1966/netherworld-console/blob/main/images/user-index.png "用户端首页") 
![生死簿导入](https://github.com/moyuc1966/netherworld-console/blob/main/images/user-lifebook.png "生死簿导入") 
![敲木鱼加功德](https://github.com/moyuc1966/netherworld-console/blob/main/images/user-woodenfish.png "敲木鱼加功德") 


