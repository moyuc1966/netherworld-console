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

module.exports = app;

