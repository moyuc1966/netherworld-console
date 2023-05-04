const express = require('express');
const app = express();

//登录接口
app.use('/api', require('./api/login.js'));

//管理员管理生死簿接口
app.use('/admin', require('./admin/book.js'));

module.exports = app;

