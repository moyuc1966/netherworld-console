const express = require('express');
const app = express();

//登录接口
app.use('/api', require('./api/login.js'));

//管理员管理生死簿接口
app.use('/admin', require('./admin/book.js'));

//勾魂部分接口
app.use('/admin', require('./admin/enchant.js'));

//阎王殿审判部分接口
app.use('/admin', require('./admin/trial.js'));

//十八层地狱相关接口
app.use('/admin', require('./admin/hell.js'));

// 轮回部分接口
app.use('/admin', require('./admin/reincarnation.js'));

//系统设置部分接口
app.use('/admin', require('./admin/systemset.js'));

//用户获取系统设置
app.use('/api', require('./api/system.js'));

//管理员管理汇款
app.use('/admin', require('./admin/remittance.js'));

//用户发起汇款
app.use('/api', require('./api/remittance.js'));

//管理员管理
app.use('/admin', require('./admin/user.js'));

//用户无需token的一些小功能
app.use('/api', require('./api/api.js'));

//全局api
app.use('/admin', require('./admin/statistics.js'));

//角色权限相关接口
app.use('/admin', require('./admin/role.js'));
module.exports = app;

