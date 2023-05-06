const express = require('express');
const router = express.Router();
const db = require('../link/link.js');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

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

//生死簿新增
router.post('/lifeBookAdd', (req, res) => {
    let { name, year, status, birthday, deathday, gender, birthplace,
        deathplace, photo, money, yinmoney, child, longevity, type, reason, marriage,
        event, attribute, description, character, yin, yang, reward, afterlife, reincarnation } = req.body;
    // 初始化默认数据
    status = isEmptyStr(status) ? status : 0;
    yin = isEmptyStr(yin) ? yin : 0;
    yang = isEmptyStr(yang) ? yang : 0;
    money = isEmptyStr(money) ? money : 0;
    yinmoney = isEmptyStr(yinmoney) ? yinmoney : 0;
    reincarnation = isEmptyStr(reincarnation) ? reincarnation : '暂无';
    reward = isEmptyStr(reward) ? reward : '暂无';
    afterlife = isEmptyStr(afterlife) ? afterlife : '暂无';
    character = isEmptyStr(character) ? character : '暂无';
    description = isEmptyStr(description) ? description : '暂无';
    attribute = isEmptyStr(attribute) ? attribute : '暂无';
    event = isEmptyStr(event) ? event : '暂无';
    marriage = isEmptyStr(marriage) ? marriage : '暂无';
    reason = isEmptyStr(reason) ? reason : '暂无';
    type = isEmptyStr(type) ? type : 0;
    longevity = isEmptyStr(longevity) ? longevity : 60;
    child = isEmptyStr(child) ? child : 0;

    //参数是否合法
    if (!isEmptyStr(name) || !isEmptyStr(year) || !isEmptyStr(birthday) || !isEmptyStr(deathday) || !isEmptyStr(gender) || !isEmptyStr(birthplace) || !isEmptyStr(deathplace)) return tw(res, 400, '请输入完整')
    // 校验birthday和deathday是否是可格式化的时间
    if (Date.parse(birthday) == NaN || Date.parse(deathday) == NaN) return tw(res, 400, '出生日期或死亡日期格式不正确')

    let uuid = getUuid(16, 16)  // 生成uuid

    const query = `INSERT INTO lifebook (name, uuid, year, status, birthday, deathday, gender, birthplace, deathplace, photo, 
        money, yinmoney, child, longevity, type, reason, marriage, event, attribute, description, characterinfo, yin, yang, reward, 
        afterlife, reincarnation, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, NOW())`;

    const values = [name, uuid, year, status, birthday, deathday, gender, birthplace, deathplace, photo,
        money, yinmoney, child, longevity, type, reason, marriage, event, attribute, description, character,
        yin, yang, reward, afterlife, reincarnation];

    // 指定长度和基数
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
    db.query(query, values, (err, result) => {
        if (err) {
            console.log(err)
            tw(res, 500, '新增失败')
        } else {
            tw(res, 200, '新增成功')
        }

    })

})

// 获取生死簿数据
router.get('/lifeBookList', (req, res) => {
    let { page, limit, uuid } = req.query;
    page = page || 1;
    limit = limit || 10;
    let start = (page - 1) * limit;
    let query
    if (isEmptyStr(uuid)) {
        query = `SELECT * FROM lifebook where uuid = '${uuid}'`;
    } else {
        query = `SELECT * FROM lifebook ORDER BY create_time DESC LIMIT ${start},${limit}`;
        console.log('没有uuid');
    }
    db.query(query, (err, result) => {
        if (err) {
            console.log(err)
            tw(res, 500, '获取失败')
        } else {
            if (!isEmptyStr(uuid)) {
                // 获取数据总数
                db.query(`SELECT COUNT(*) FROM lifebook`, (err, count) => {
                    if (err) {
                        console.log(err)
                        tw(res, 500, '获取失败')
                    } else {
                        res.send({
                            'code': 200,
                            'msg': '获取成功',
                            'total': count[0]['COUNT(*)'],
                            'data': result,
                        })
                    }
                })
            } else {
                res.send({
                    'code': 200,
                    'msg': '获取成功',
                    'data': result[0]
                })
            }
        }
    })

})


// 生死簿数据搜索
router.get('/lifeBookSearch', (req, res) => {
    // 支持对id，uuid，name，精确到天的出生日期和死亡日期，以及生辰八字的搜索
    let { page, limit, id, uuid, name, birthday, deathday, year } = req.query;
    if (!isEmptyStr(id) && !isEmptyStr(uuid) && !isEmptyStr(name) && !isEmptyStr(birthday) && !isEmptyStr(deathday) && !isEmptyStr(year)) return tw(res, 400, '请提交搜索参数')
    page = page || 1;
    limit = limit || 10;
    let start = (page - 1) * limit;
    let pages = `LIMIT ${start},${limit}`;
    let sql = `SELECT * FROM lifebook WHERE 1=1`;
    let countSql = `SELECT COUNT(*) FROM lifebook WHERE 1=1`;
    if (isEmptyStr(id)) {
        sql += ` AND id = ${id}`;
        countSql += ` AND id = ${id}`;
    }
    if (isEmptyStr(uuid)) {
        sql += ` AND uuid = '${uuid}'`;
        countSql += ` AND uuid = '${uuid}'`;
    }
    if (isEmptyStr(name)) {
        sql += ` AND name = '${name}'`;
        countSql += ` AND name = '${name}'`;
    }
    if (isEmptyStr(birthday)) {
        sql += ` AND DATE(birthday) = '${birthday}'`;
        countSql += ` AND DATE(birthday) = '${birthday}'`;
    }
    if (isEmptyStr(deathday)) {
        sql += ` AND DATE(deathday) = '${deathday}'`;
        countSql += ` AND DATE(deathday) = '${deathday}'`;
    }
    if (isEmptyStr(year)) {
        sql += ` AND year = '${year}'`;
        countSql += ` AND year = '${year}'`;
    }
    sql += ` ORDER BY create_time DESC ${pages}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            tw(res, 500, '获取失败')
        } else {
            // 获取数据总数
            db.query(countSql, (err, count) => {
                if (err) {
                    console.log(err)
                    tw(res, 500, '获取失败')
                } else {
                    res.send({
                        'code': 200,
                        'msg': '获取成功',
                        'total': count[0]['COUNT(*)'],
                        'data': result,
                    })
                }
            })
        }
    })
})


// 修改生死簿数据
router.put('/lifeBookUpdate', (req, res) => {
    let { id, name, year, status, birthday, deathday, gender, birthplace,
        deathplace, money, yinmoney, child, longevity, type, reason, marriage,
        event, attribute, description, character, yin, yang } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请提交id')

    // 遍历对象，如果值为空，判断为删除该项
    delete req.body.id
    for (let key in req.body) {
        if (!isEmptyStr(req.body[key])) {
            delete req.body[key]
        }
    }
    function isEmptyObj(obj) {
        for (let key in obj) {
            return false
        }
        return true
    }
    if (isEmptyObj(req.body)) return tw(res, 400, '提交修改项')
    // 修改数据
    let query = `UPDATE lifebook SET `;
    for (let key in req.body) {
        query += `${key} = '${req.body[key]}',`
    }
    query = query.slice(0, -1);
    query += ` WHERE id = ${id}`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err)
            tw(res, 500, '修改失败')
        } else {
            res.send({
                'code': 200,
                'msg': '修改成功',
            })
        }
    })

})

// 上传文件中间件
const uploadFun = (req, res, next) => {
    let storage = multer.diskStorage({
        //指定保存位置
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/photo'))
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
    }).single('photo');
    upload(req, res, (err) => {
        if (err) {
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

// 修改照片
router.post('/lifeBookUpdateImg', uploadFun, (req, res) => {
    let { id } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请提交id')
    // 修改数据
    let query = `UPDATE lifebook SET photo = '${img}' WHERE id = ${id}`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err)
            tw(res, 500, '修改失败')
        } else {
            res.send({
                'code': 200,
                'msg': '修改成功',
                data: '/public/photo/' + req.filename,
            })
        }
    })

})

// 删除生死簿数据,支持多选
router.delete('/lifeBookDelete', (req, res) => {
    let { id } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请提交id')
    // 删除数据
    let query = `DELETE FROM lifebook WHERE id IN (${id})`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err)
            tw(res, 500, '删除失败')
        } else {
            res.send({

                'code': 200,
                'msg': '删除成功',
            })
        }
    })
})
module.exports = router;