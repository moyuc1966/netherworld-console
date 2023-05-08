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
    if (!isEmptyStr(key)) return tw(res, 400, '参数错误')
    let sql = `select * from setting where \`key\`='${key}'`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        res.send({
            'code': 200,
            'msg': '获取成功',
            'data': result[0]
        })
    })
})



module.exports = router;