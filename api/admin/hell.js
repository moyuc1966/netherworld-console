//十八层地狱相关接口
const express = require('express');
const router = express.Router();
const db = require('../link/link.js');
const getUuid = require('../tools/uuid.js');

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

//添加设备
router.post('/helladd', (req, res) => {
    let { name, floor } = req.body;
    if (!isEmptyStr(name) || !isEmptyStr(floor)) return tw(res, 400, '请填写完整');
    //校验floor是数字，并且是否为1-18
    if (isNaN(floor) || floor < 1 || floor > 18) return tw(res, 400, '位置必须为1-18的数字');
    //校验name长度是否大于20
    if (name.length > 20) return tw(res, 400, '名称长度不能超过20');
    let sql = `insert into helldevice (name,floor,create_time,status) values ('${name}','${floor}',now(),0)`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        tw(res, 200, '添加成功');
    })
})

//获取设备列表
router.get('/helllist', (req, res) => {
    let { page, limit, floor } = req.query;
    page = page || 1;
    limit = limit || 10;
    let sql = `select * from helldevice where 1=1`;
    if (isEmptyStr(floor)) sql += ` and floor=${floor}`;
    sql += ` order by create_time desc limit ${(page - 1) * limit},${limit}`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        let sql2 = `select count(*) as count from helldevice where 1=1`;
        if (floor) sql2 += ` and floor=${floor}`;
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

// 修改设备
router.put('/hellupdate', (req, res) => {
    let { id, name, floor } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请选择要修改的设备');
    if (!isEmptyStr(name) && !isEmptyStr(floor)) return tw(res, 400, '请填写修改内容');
    let sql = `update helldevice set `;
    let arr = []
    if (isEmptyStr(name)) {
        if (name.length > 20) return tw(res, 400, '名称长度不能超过20');
        arr.push(`name='${name}'`);
    }
    if (isEmptyStr(floor)) {
        if (isNaN(floor) || floor < 1 || floor > 18) return tw(res, 400, '位置必须为1-18的数字');
        arr.push(`floor='${floor}'`);
    }
    sql += arr.join(',') + ` where id=${id}`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        tw(res, 200, '修改成功');
    })
})

//修改设备状态
router.put('/hellstatus', (req, res) => {
    let { id, status } = req.body;
    if (!isEmptyStr(id) || !isEmptyStr(status)) return tw(res, 400, '请选择要修改的设备');
    if (status != 0 && status != 1) return tw(res, 400, '状态错误');
    let sql = `update helldevice set status=${status} where id=${id}`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        tw(res, 200, '修改成功');
    })
})

//删除设备
router.delete('/helldel', (req, res) => {
    let { id } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请选择要删除的设备');
    let sql = `delete from helldevice where id=${id}`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        tw(res, 200, '删除成功');
    })
})

//添加设备使用记录
router.post('/hellrecordadd', (req, res) => {
    let { uid, floor, device, time, reason } = req.body;
    if (!isEmptyStr(uid) || !isEmptyStr(floor) || !isEmptyStr(device) || !isEmptyStr(time) || !isEmptyStr(reason)) return tw(res, 400, '请填写完整');
    //校验floor是数字，并且是否为1-18
    if (isNaN(floor) || floor < 1 || floor > 18) return tw(res, 400, '位置必须为1-18的数字');
    //查询设备名称
    let sql1 = `select name from helldevice where id=${device}`;
    db.query(sql1, (err, result) => {
        if (err) return sqlerr(res, err);
        let sql = `update lifebook set status=4,punishment='在${floor}层地狱受${result[0].name}处刑，共${time}' where id=${uid}`;
        db.query(sql, (err, result) => {
            if (err) return sqlerr(res, err);
            // 添加使用记录
            let sql2 = `insert into helllog (uid,floor,device,time,reason,create_time) values (${uid},${floor},'${device}','${time}','${reason}',now())`;
            db.query(sql2, (err, result) => {
                if (err) return sqlerr(res, err);
                tw(res, 200, '添加成功');
            })
        })

    })

})

// 获取设备使用记录
router.get('/hellrecordlist', (req, res) => {
    let { page, limit, floor, device, id } = req.query;
    page = page || 1;
    limit = limit || 10;
    if (isEmptyStr(id)) {
        let sql = `select h.id as id,h.uid as uid,h.floor as floor,h.device as device,h.time as time,h.reason as reason,h.create_time as create_time,l.name as name,l.uuid as user_uuid from helllog as h,lifebook as l where h.id = ${id} and l.id = h.uid`
        db.query(sql, (err, result) => {
            if (err) return sqlerr(res, err);
            res.send({
                'code': 200,
                'msg': '获取成功',
                'data': result[0],
            })
        })
    } else {
        let sql = `select h.id as id,h.uid as uid,h.floor as floor,h.device as device,h.time as time,h.reason as reason,h.create_time as create_time,l.name as name,l.uuid as user_uuid from helllog as h,lifebook as l where l.id = h.uid `
        if (isEmptyStr(floor)) sql += ` and h.floor=${floor}`;
        if (isEmptyStr(device)) sql += ` and h.device=${device}`;
        sql += ` order by create_time desc limit ${(page - 1) * limit},${limit}`;
        db.query(sql, (err, result) => {
            if (err) sqlerr(res, err);
            let sql2 = `select count(*) as count from helllog where 1=1`;
            if (isEmptyStr(floor)) sql2 += ` and floor=${floor}`;
            if (isEmptyStr(device)) sql2 += ` and device=${device}`;
            db.query(sql2, (err, result2) => {
                if (err) sqlerr(res, err);
                res.send({
                    'code': 200,
                    'msg': '获取成功',
                    'count': result2[0].count,
                    'data': result,
                })
            })
        })
    }
})

//删除使用记录
router.delete('/hellrecorddel', (req, res) => {
    let { id } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请选择要删除的记录');
    let sql = `delete from helllog where id=${id}`;
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err);
        tw(res, 200, '删除成功');
    })
})

//修改使用记录
router.put('/hellrecordedit', (req, res) => {
    let { id, floor, device, time, reason } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '选择修改的记录');
    if (isEmptyStr(floor) && isEmptyStr(device) && isEmptyStr(time) && isEmptyStr(reason)) return tw(res, 400, '请选择要修改的内容');
    let sql = `update helllog set `;
    let arr = [];
    if (isEmptyStr(floor)) arr.push(`floor=${floor}`);
    if (isEmptyStr(device)) arr.push(`device=${device}`);
    if (isEmptyStr(time)) arr.push(`time=${time}`);
    if (isEmptyStr(reason)) arr.push(`reason=${reason}`);
    sql += arr.join(',') + ` where id=${id}`;
    //修改生死簿内受刑内容
    let sql1 = `select uid,floor,time from helllog where id=${id}`;
    db.query(sql1, (err, result) => {
        if (err) return sqlerr(res, err);
        let sql2 = `select name from helldevice where id=${device}`;
        db.query(sql2, (err, result2) => {
            if (err) return sqlerr(res, err);
            floor = !isEmptyStr(floor) ? result[0].floor : floor;
            time = !isEmptyStr(time) ? result[0].time : time;
            let sql3 = `update lifebook set punishment='在${floor}层地狱受${result2[0].name}处刑，共${time}' where id=${result[0].uid}`;
            db.query(sql3, (err, result3) => {
                if (err) return sqlerr(res, err);
                db.query(sql, (err, result) => {
                    if (err) return sqlerr(res, err);
                    tw(res, 200, '修改成功');
                })
            })
        })
    })

})

module.exports = router;