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

//敲木鱼加功德
router.post('/user/addmerit', (req, res) => {
    let uuid = req.body.uniqueid;
    if (!isEmptyStr(uuid)) return tw(res, 400, '请选择加功德的人');
    let sql = `update lifebook set yang = yang + 1 where uuid = '${uuid}'`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        tw(res, 200, '加功德成功');
    })
})

module.exports = router;