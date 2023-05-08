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


//添加轮回盘使用记录
router.post('/reincarnationadd', (req, res) => {
    //添加记录，修改lifebook的status，修改reincarnationid，reincarnation
    let { aid, uid, type, reason } = req.body;
    if (!isEmptyStr(aid) || !isEmptyStr(uid) || !isEmptyStr(type) || !isEmptyStr(reason)) return tw(res, 400, '请填写完整');
    //添加数据
    let sql = `insert into reincarnationlog (aid,uid,type,reason,create_time) values ('${aid}','${uid}','${type}','${reason}',now())`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        //修改lifebook的status=3,reincarnationid，reincarnation=进入type轮回,其中reincarnationid是上面添加的id
        console.log(result.insertId);
        let sql2 = `update lifebook set status=3,reincarnationid=${result.insertId},reincarnation='进入${type}轮回',afterlife='进入${type}轮回' where id=${uid}`;
        db.query(sql2, (err, result2) => {
            if (err) return sqlerr(res, err);
            tw(res, 200, '添加成功');
        })
    })

})

//获取轮回盘使用记录
router.get('/reincarnationlist', (req, res) => {
    let { page, limit, aid, uid, type } = req.query;
    page = page || 1;
    limit = limit || 10;
    // 输出包括reincarnationlog中数据，还有根据aid和uid查询出来的user中的nickname和lifebook中的name
    let sql = `select reincarnationlog.*,user.nickname as aname,lifebook.name as uname,lifebook.uuid as user_uuid from reincarnationlog,user,lifebook where reincarnationlog.aid=user.id and reincarnationlog.uid=lifebook.id`;
    if (isEmptyStr(aid)) sql += ` and reincarnationlog.aid=${aid}`;
    if (isEmptyStr(uid)) sql += ` and reincarnationlog.uid=${uid}`;
    if (isEmptyStr(type)) sql += ` and reincarnationlog.type='${type}'`;
    sql += ` order by reincarnationlog.create_time desc limit ${(page - 1) * limit},${limit}`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        let sql2 = `select count(*) as count from reincarnationlog,user,lifebook where reincarnationlog.aid=user.id and reincarnationlog.uid=lifebook.id`;
        if (aid) sql2 += ` and reincarnationlog.aid=${aid}`;
        if (uid) sql2 += ` and reincarnationlog.uid=${uid}`;
        if (type) sql2 += ` and reincarnationlog.type='${type}'`;
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

// 修改轮回盘使用记录
router.put('/reincarnationedit', (req, res) => {
    let { id, type, reason } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请选择需要修改的记录');
    if (!isEmptyStr(type) && !isEmptyStr(reason)) return tw(res, 400, '请填写完整');
    let sql = `update reincarnationlog set `;
    let arr = []
    if (isEmptyStr(type)) arr.push(`type='${type}'`);
    if (isEmptyStr(reason)) arr.push(`reason='${reason}'`);
    sql += arr.join(',');
    sql += `where id=${id}`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        tw(res, 200, '修改成功');
    })
})

// 删除轮回盘使用记录
router.delete('/reincarnationdel', (req, res) => {
    let { id } = req.query;
    if (!isEmptyStr(id)) return tw(res, 400, '请选择需要删除的记录');
    let sql = `delete from reincarnationlog where id=${id}`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        tw(res, 200, '删除成功');
    })
})


module.exports = router;