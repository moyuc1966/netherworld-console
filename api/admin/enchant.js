const express = require('express');
const router = express.Router();
const db = require('../link/link.js');
const path = require('path');
const multer = require('multer');

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

//获取需要勾魂的数据
router.get('/getEnchantData', (req, res) => {
    let { page, limit, name } = req.query;
    page = page || 1;
    limit = limit || 10;
    let and = ''
    if (isEmptyStr(name)) and = `and name like '%${name}%'`
    // 获取deathday在今天到今天加30天之内的数据
    let sql = `select * from lifebook where deathday between curdate() and date_add(curdate(),interval 30 day) and isnull(reaperid) ${and} limit ${(page - 1) * limit},${limit}`;
    let sql2 = `select count(*) as count from lifebook where deathday between curdate() and date_add(curdate(),interval 30 day) and isnull(reaperid) ${and}`;

    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            tw(res, 400, '获取数据失败');
            return;
        }
        db.query(sql2, (err, data2) => {
            if (err) {
                console.log(err);
                tw(res, 400, '获取数据失败');
                return;
            }
            res.send({
                'code': 200,
                'msg': '获取数据成功',
                'count': data2[0].count,
                'data': data,
            })
        })
    })
})
// uuid生成函数
function getUuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = []
    let i
    radix = radix || chars.length
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
        let r
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    return uuid.join('')
}

const uploadFun = (req, res, next) => {
    let storage = multer.diskStorage({
        //指定保存位置
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/enchant'))
        },
        //指定保存文件名
        filename: (req, file, cb) => {
            //处理保存文件名
            let extname = path.extname(file.originalname);
            filename = file.fieldname + "-" + Date.now() + extname;
            cb(null, filename);
        }
    })

    let limits = {
        //设置上传数量，大小
        files: 1,
        fileSize: 1024 * 1024 * 3 // 3MB
    }
    const upload = multer({
        storage: storage,
        //限制文件大小
        limits: limits,
        fileFilter: function (req, file, cb) {
            // 限制文件上传类型，仅可上传png格式图片
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
                cb(null, true)
            } else {
                cb(null, false)
                let err = new Error();
                err.code = 'LIMIT_FILE_TYPES';
                cb(err)
            }
        }
    }).single('enchant');
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            if (err.code == 'LIMIT_FILE_SIZE') {
                res.send({
                    code: '500',
                    msg: '上传失败，文件过大',
                })
            } else if (err.code == 'LIMIT_FILE_TYPES') {
                res.send({
                    code: '500',
                    msg: '文件类型不合法',
                })
            } else if (err.code == 'ENOENT') {
                res.send({
                    code: '500',
                    msg: '权限不足',
                })
            } else {
                res.send({
                    code: '500',
                    msg: '其他错误',
                    Error: err
                })
            }
        } else {
            //将文件名单独拿出来
            req.filename = req.file.filename
            next()
        }
    })
}
// 添加勾魂使者
router.post('/addEnchanter', uploadFun, (req, res) => {
    let photo = '/public/enchant/' + req.filename;
    let uuid = getUuid(16, 16)
    let { name, gender, description } = req.body;
    if (!isEmptyStr(name)) return tw(res, 400, '姓名不能为空');

    let status = 0;
    description = description || '暂无介绍';
    gender = gender || 0;
    let role = 2
    let sql = `insert into reaper (name,uuid,gender,photo,description,create_time,role,status) values ('${name}','${uuid}',${gender},'${photo}',
    '${description}',now(),2,${status})`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            tw(res, 400, '添加失败');
            return;
        }
        tw(res, 200, '添加成功');
    })
})

//勾魂使者列表
router.get('/getEnchanterList', (req, res) => {
    let { page, limit, id, name } = req.query;
    page = page || 1;
    limit = limit || 10;
    let sql = `select * from reaper where 1=1`;
    let sql2 = `select count(*) as count from reaper where 1=1`;
    if (isEmptyStr(id)) {
        sql += ` and id=${id}`;
        sql2 += ` and id=${id}`;
    } else {
        if (isEmptyStr(name)) {
            sql += ` and name like '%${name}%'`;
            sql2 += ` and name like '%${name}%'`;
        }
    }
    sql += ` limit ${(page - 1) * limit},${limit}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            tw(res, 400, '获取数据失败');
            return;
        }
        db.query(sql2, (err, data2) => {
            if (err) {
                console.log(err);
                tw(res, 400, '获取数据失败');
                return;
            }
            res.send({
                'code': 200,
                'msg': '获取数据成功',
                'count': data2[0].count,
                'data': data,
            })
        })
    })
})

// 勾魂使者信息修改
router.put('/updateEnchanter', (req, res) => {
    let { set, name, gender, description, status, id } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, 'id不能为空');
    if (set == '1') {
        if (!isEmptyStr(status)) return tw(res, 400, '状态不能为空');
        //判断status是否为0或1或2
        if (status != 0 && status != 1 && status != 2) return tw(res, 400, '状态不合法');
        let sql = `update reaper set status=${status} where id=${req.body.id}`;
        db.query(sql, (err, data) => {
            if (err) {
                console.log(err);
                tw(res, 400, '修改失败');
                return;
            }
            tw(res, 200, '修改成功');
        })
    } else {
        if (!isEmptyStr(name) && !isEmptyStr(gender) && !isEmptyStr(description)) return tw(res, 400, '参数不能为空');
        let sql = `select * from reaper where id=${id}`;
        db.query(sql, (err, data) => {
            if (err) {
                console.log(err);
                tw(res, 400, '信息异常');
                return;
            }
            name = isEmptyStr(name) ? name : data[0].name;
            gender = isEmptyStr(gender) ? gender : data[0].gender
            description = isEmptyStr(description) ? description : data[0].description
            // 判断gender是否为0或1
            if (gender != '0' && gender != '1') return tw(res, 400, '性别不合法');
            //修改数据库中的数据
            let sql = `update reaper set name='${name}',gender=${gender},description='${description}' where id=${req.body.id}`
            db.query(sql, (err, data) => {
                if (err) {
                    console.log(err);
                    tw(res, 400, '修改失败');
                    return;
                }
                tw(res, 200, '修改成功');
            })

        })
    }
})


//勾魂使者删除
router.delete('/deleteEnchanter', (req, res) => {
    let uuid = req.query.uuid;
    if (!isEmptyStr(uuid)) return tw(res, 400, 'uuid不能为空');
    let querySql = `select * from reaper where uuid='${uuid}'`;
    db.query(querySql, (err, data) => {
        if (err) return tw(res, 400, '读取失败');
        if (data[0].role == 4) {
            //此勾魂使者是管理员的情况，修改管理员为4的普通管理员
            let sql = `update user set role=4 where username = '${uuid}'`;
            db.query(sql, (err, data) => {
                if (err) return tw(res, 400, '初始化失败');
            })
        }
    })
    let sql = `delete from reaper where uuid='${uuid}'`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            tw(res, 400, '删除失败');
            return;
        }
        tw(res, 200, '删除成功');
    })
})

//勾魂处理
router.put('/handleEnchanter', (req, res) => {
    let { id, set } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, 'id不能为空');
    let repid = req.auth.id
    //检查是否有该勾魂使者
    // let sql = `select * from reaper where id=${req.username}`;
    // db.query(sql, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         tw(res, 400, '无权操作');
    //         return;
    //     }
    //将lifebook表中的status改为2
    let time = formatDate(new Date());
    let sql;
    sql = `update lifebook set status=2,reaperid=${repid} where id=${id}`;
    if (set == '1') sql = `update lifebook set status=2,deathday='${time}',reaperid=${repid} where id=${id}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            tw(res, 400, '操作失败');
            return;
        }
        tw(res, 200, '操作成功');
    })
    // })

    //格式化时间，将时间戳转换为yyyy-mm-dd hh:mm:ss格式
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


module.exports = router;