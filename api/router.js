const express = require('express');
const app = express();

//登录接口
app.use('/api', require('./api/login.js'));



module.exports = app;

