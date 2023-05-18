const express = require('express');
const router = express.Router();
const db = require('../link/link.js');

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

function sqlerr(res, err) {
    console.log(err);
    tw(res, 500, '服务器错误');
}

//获取系统设置
router.get('/systemset', (req, res) => {
    let key = req.query.key;
    let sql = `select * from setting`;
    if (key) sql += ` where \`key\`='${key}'`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        res.send({
            'code': 200,
            'msg': '获取成功',
            'data': result
        })
    })
})

//修改系统设置
router.put('/systemset', (req, res) => {
    let key = req.body.key;
    let value = req.body.value;
    if (!isEmptyStr(key) || !isEmptyStr(value)) return tw(res, 400, '参数错误')
    let sql = `update setting set \`value\`='${value}',create_time='${formatDate(new Date())}' where \`key\`='${key}'`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        res.send({
            'code': 200,
            'msg': '修改成功'
        })
    })

    function formatDate(time) {
        let date = new Date(time);
        let year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }
})

//删除某个系统设置
router.delete('/systemset', (req, res) => {
    let id = req.query.id;
    if (!isEmptyStr(id)) return tw(res, 400, '参数错误')
    let sql = `delete from setting where id='${id}'`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        res.send({
            'code': 200,
            'msg': '删除成功'
        })
    })
})


module.exports = router;