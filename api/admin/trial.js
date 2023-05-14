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

//审判某人接口
router.post('/trial', (req, res) => {
    let { lifebook_id, title, record } = req.body;
    if (!isEmptyStr(lifebook_id) || !isEmptyStr(title) || !isEmptyStr(record)) return tw(res, 400, '请填写完整');
    const uuid = 'TR' + getUuid(16, 16);
    let judge_id = req.auth.id
    //查询审判长角色id
    const sql = `select id from role where name = '审判长'`;
    db.query(sql, (err, data) => {
        if (req.auth.role != 1) {
            if (err) return sqlerr(res, err)
            if (data.length === 0) return tw(res, 400, '此权限不存在');
            if (req.auth.role !== data[0].id) return tw(res, 400, '您不是审判长，无法审判')
        }

        //查询该生命册是否存在
        const sql1 = `select id,reaperid from lifebook where id = '${lifebook_id}'`;
        db.query(sql1, (err, data) => {
            if (err) return sqlerr(res, err)
            if (data.length === 0) return tw(res, 400, '该数据不存在');
            let reaper_id = data[0].reaperid;
            if (reaper_id == null) return tw(res, 400, '该人员未被勾魂')
            if (data[0].status < 2) return tw(res, 400, '该人员未在府中')

            //查询该生命册是否已经被审判
            const sql2 = `select id from judgement where lifebook_id = '${lifebook_id}'`;
            db.query(sql2, (err, data) => {
                if (err) return sqlerr(res, err)
                if (data.length !== 0) return tw(res, 400, '该人员已被审判');
                //插入审判记录
                const sql4 = `insert into judgement(uuid,lifebook_id,judge_id,title,record,reaper_id,create_time) values('${uuid}','${lifebook_id}','${judge_id}','${title}','${record}','${reaper_id}',now())`;
                db.query(sql4, (err, data) => {
                    if (err) return sqlerr(res, err)
                    tw(res, 200, '审判成功');
                })
            })
        })
    })
});

// 获取审判列表
router.get('/getJudgementList', (req, res) => {
    let { page, limit, title } = req.query;
    page = page || 1;
    limit = limit || 10;
    // Validate page and limit
    if (page < 1 || limit < 1) {
        return res.status(400).send({
            'code': 400,
            'msg': '页码错误'
        });
    }
    let sql = `select * from judgement where 1=1`;
    let sql2 = `select count(*) as count from judgement where 1=1`;
    if (isEmptyStr(title)) {
        // Sanitize title
        title = sqlstring.escape(title);
        sql += ` and title like '%${title}%'`;
        sql2 += ` and title like '%${title}%'`;
    }
    sql += ` order by create_time desc limit ${(page - 1) * limit},${limit}`;
    db.query(sql, (err, data) => {
        if (err) return sqlerr(res, err)
        db.query(sql2, (err, data2) => {
            if (err) return sqlerr(res, err)
            res.send({
                'code': 200,
                'msg': '获取成功',
                total: data2[0].count,
                data: data,
            })
        })
    })
})

//修改审判结果
router.put('/updateJudgement', (req, res) => {
    let { id, title, record } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请选择要修改的数据');
    if (!isEmptyStr(title) && !isEmptyStr(record)) return tw(res, 400, '请填写需要修改的内容');
    //三种情况，只修改title，只修改record，都修改
    let sql = `update judgement set `;
    if (!isEmptyStr(title) && isEmptyStr(record)) {
        sql += `record = '${record}'`;
        console.log('只修改record');
    } else if (isEmptyStr(title) && !isEmptyStr(record)) {
        sql += `title = '${title}'`;
        console.log('只修改title');
    } else {
        sql += `title = '${title}',record = '${record}'`;
    }
    sql += ` where id = '${id}'`;
    db.query(sql, (err, data) => {
        if (err) return sqlerr(res, err)
        tw(res, 200, '修改成功');
    })
})

//删除审判记录
router.delete('/deleteJudgement', (req, res) => {
    let uuid = req.query.uuid;
    if (!isEmptyStr(uuid)) return tw(res, 400, '请选择要删除的数据');
    const sql = `delete from judgement where uuid = '${uuid}'`;
    db.query(sql, (err, data) => {
        if (err) return sqlerr(res, err)
        tw(res, 200, '删除成功');
    })
})

//获取审判详情
router.get('/getJudgementDetail', (req, res) => {
    let uuid = req.query.uuid;
    if (!isEmptyStr(uuid)) return tw(res, 400, '请选择要查看的数据');
    const sql = `select * from judgement where uuid = '${uuid}'`;
    db.query(sql, (err, data) => {
        if (err) return sqlerr(res, err)
        if (data.length === 0) return tw(res, 400, '该数据不存在');
        // 获取审判长姓名和勾魂使者姓名
        const sql2 = `select a.nickname as judge_name,b.name as reaper_name from judgement as j left join user as a on j.judge_id = a.id left join reaper as b on j.reaper_id = b.id where j.uuid = '${uuid}'`;
        db.query(sql2, (err, data2) => {
            if (err) return sqlerr(res, err)
            //获取生死簿中的信息
            let sql3 = `select * from lifebook where id = '${data[0].lifebook_id}'`;
            db.query(sql3, (err, data3) => {
                if (err) return sqlerr(res, err)
                let senddata = {
                    ...data[0],
                    judge_name: data2[0].judge_name,
                    reaper_name: data2[0].reaper_name,
                    name: data3[0].name,
                    user_uuid: data3[0].uuid,
                    year: data3[0].year,
                    birthday: data3[0].birthday,
                    deathday: data3[0].deathday,
                    gender: data3[0].gender,
                    birthplace: data3[0].birthplace,
                    deathplace: data3[0].deathplace,
                    type: data3[0].type,
                    attribute: data3[0].attribute,
                    afterlife: data3[0].afterlife,
                    reincarnation: data3[0].reincarnation,
                    photo: data3[0].photo,
                    info: {}
                }
                //如果lifebook中的status为3，则在reincarnationlog根据uid字段查询出该人的转世信息
                function handleSql4(status, callback) {
                    if (status === 3) {
                        let sql4 = `select * from reincarnationlog where uid = '${data3[0].id}'`;
                        db.query(sql4, (err, data4) => {
                            if (err) return sqlerr(res, err)
                            callback(data4[0]);
                        })
                    } else if (status === 4) {
                        let sql4 = `select * from helllog where uid = '${data3[0].id}'`;
                        db.query(sql4, (err, data4) => {
                            if (err) return sqlerr(res, err)
                            callback(data4[0]);
                        })
                    } else {
                        callback(null);
                    }
                }
                handleSql4(data3[0].status, (data4) => {
                    if (data4) {
                        senddata.info = data4;
                    }
                    res.send({
                        'code': 200,
                        'msg': '获取成功',
                        data: senddata
                    })
                });
            })
        })

    })
})


module.exports = router;