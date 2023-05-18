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

//发起一笔汇款
router.post('/remittance', (req, res) => {
    let { relationship, uid, money, reason } = req.body;
    if (!isEmptyStr(relationship) || !isEmptyStr(uid) || !isEmptyStr(money) || !isEmptyStr(reason)) return tw(res, 400, '参数错误')
    //money必须是数字并且大于0
    if (isNaN(money) || money <= 0) return tw(res, 400, '金额错误')

    //检查是否允许汇款
    let sql = `select s.value from setting as s where s.key = 'remittance'`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        if (result[0].value === '0') return tw(res, 400, '暂时不允许汇款')
        //检查uid在lifebook中是否存在
        let sql = `select * from lifebook where uuid='${uid}'`;
        db.query(sql, (err, result) => {
            if (err) return sqlerr(res, err);
            if (result.length === 0) return tw(res, 400, '用户不存在')
            //汇款，插入到remittance表中，并且修改lifebook中的yinmoney
            let sql = `insert into remittance (relationship, uid, money, reason,create_time) values ('${relationship}', '${uid}', '${money}', '${reason}',now())`;
            db.query(sql, (err, result) => {
                if (err) return sqlerr(res, err);
                let sql = `update lifebook set yinmoney=yinmoney+${money} where uuid='${uid}'`;
                db.query(sql, (err, result) => {
                    if (err) return sqlerr(res, err);
                    //返回lifebook中的yinmoney
                    let sql = `select yinmoney from lifebook where uuid='${uid}'`;
                    db.query(sql, (err, result) => {
                        if (err) return sqlerr(res, err);
                        res.send({
                            'code': 200,
                            'msg': '汇款成功',
                            'data': result[0]
                        })
                    })
                })
            })
        })

    })

})


module.exports = router;