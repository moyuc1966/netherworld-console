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

//获取汇款列表
router.get('/remittance', (req, res) => {
    let { page, limit, relationship, uid, name } = req.query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    //返回汇款记录以及lifebook中的name和yinmoney
    let sql = `select remittance.*,lifebook.name,lifebook.yinmoney from remittance left join lifebook on remittance.uid=lifebook.uuid where 1=1`;
    if (relationship) sql += ` and remittance.relationship='${relationship}'`;
    if (uid) sql += ` and remittance.uid='${uid}'`;
    if (name) sql += ` and lifebook.name like '%${name}%'`;
    sql += ` order by remittance.create_time desc limit ${(page - 1) * limit},${limit}`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        let sql2 = `select count(*) as count from remittance where 1=1`;
        if (relationship) sql2 += ` and relationship='${relationship}'`;
        if (uid) sql2 += ` and uid='${uid}'`;
        db.query(sql2, (err, result2) => {
            if (err) return sqlerr(res, err);
            res.send({
                'code': 200,
                'msg': '获取成功',
                'count': result2[0].count,
                'data': result,
            })
        })
    })
})


//删除汇款记录
router.delete('/remittance', (req, res) => {
    let id = req.query.id;
    if (!isEmptyStr(id)) return tw(res, 400, '参数错误')
    //删除记录，并且将lifebook中的yinmoney减去相应的值
    let sql = `update lifebook set yinmoney=yinmoney-(select money from remittance where id='${id}') where uuid=(select uid from remittance where id='${id}')`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        let sql2 = `delete from remittance where id='${id}'`;
        db.query(sql2, (err, result2) => {
            if (err) return sqlerr(res, err);
            res.send({
                'code': 200,
                'msg': '删除成功'
            })
        })
    })
})

module.exports = router;