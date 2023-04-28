const express = require('express');
const cors = require('cors');
const app = express();
var { expressjwt } = require("express-jwt");


//配置跨域
app.use(cors());

//配置解析token的中间件
app.use(expressjwt({ secret: 'moyc^_^', algorithms: ['HS256'] }).unless({ path: [/\/api\//, /\/public\//] }));

//挂载静态资源
app.use('/public', express.static('public'));

//解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 引入并且挂载路由
app.use(require('./router.js'))

//全局错误处理中间件
app.use((err, req, res, next) => {
    //token验证为通过
    if (err.name === 'UnauthorizedError') {
        res.send({ code: 403, msg: '非法请求' })
        //数据库错误
    } else if (err.name == 'DatabaseError') {
        res.send({ code: err.status, msg: err.message })
        //其他错误
    } else {
        console.log('----ERROR: ' + err.message);
        res.send({ code: 500, msg: '服务器错误' })
    }
})

//启动服务器
app.listen(3000, () => {
    console.log('Service started successfully, running on http://localhost:3000');
})