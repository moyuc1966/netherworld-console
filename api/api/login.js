const express = require('express');
const router = express.Router();
const db = require('../link/link.js');
const jwt = require('jsonwebtoken');
const md5 = require('../enc.js');

// 封装固定格式的返回体
const tw = (res, code, msg) => {
    res.send({
        'code': code,
        'msg': msg
    })
}

function isEmptyStr(s) {
    if (s == null || s === '') {
        return false
    }
    return true
}
// 登录接口
router.post('/login', (req, res) => {
    let { username, password } = req.body;
    if (!isEmptyStr(username) || !isEmptyStr(password)) return tw(res, 400, '请输入完整')
    // 校验username和password是否合法：只能是数字、字母、下划线，长度需要大于6且小于22
    let reg = /^[a-zA-Z0-9_]{4,22}$/;
    if (!reg.test(username) || !reg.test(password)) return tw(res, 400, '用户名或密码不合法')
    // 校验通过，查询数据库
    let sql = `select * from user where username='${username}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return tw(res, 500, '数据库错误')
        }
        if (result.length === 0) return tw(res, 400, '账号或密码错误')
        // 校验密码
        let pass = md5(password);
        if (pass !== result[0].password) return tw(res, 400, '账号或密码错误')
        if (result[0].status == '1') return tw(res, 403, '该用户已被禁用')
        // 生成token
        let config = {
            username: username,
            role: result[0].role,
            id: result[0].id
        }
        const token = jwt.sign(config, 'moyc^_^', { expiresIn: '7d' })
        res.send({
            'code': 200,
            'msg': '登录成功',
            'token': token
        })
    })
});



module.exports = router