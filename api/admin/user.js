const express = require('express');
const router = express.Router();
const db = require('../link/link.js');
const md5 = require('../enc.js');

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

//获取管理员列表，只有超级role为1的管理员才能获取
router.get('/admin/list', (req, res) => {
    let { page, limit, username, id, nickname } = req.query;
    page = page || 1;
    limit = limit || 10;
    //身份校验
    if (req.auth.role !== 1) {
        tw(res, 403, '无权限');
        return;
    }
    if (isEmptyStr(id)) {
        let sql = `select id,username,nickname,create_time,update_time,create_time,role,status,(select name from role where id = user.role) as role_name from user where id = ${id}`;
        db.query(sql, (err, result) => {
            if (err) {
                sqlerr(res, err);
                return;
            }
            res.send({
                'code': 200,
                'msg': '获取成功',
                'data': result[0]
            })
        })
    } else {
        let sql = `select id,username,nickname,create_time,create_time,update_time,role,status,(select name from role where id = user.role) as role_name from user where 1=1`
        if (isEmptyStr(username)) {
            sql += ` and username like '%${username}%'`
        }
        if (isEmptyStr(nickname)) {
            sql += ` and nickname like '%${nickname}%'`
        }
        sql += ` limit ${(page - 1) * limit}, ${limit}`
        db.query(sql, (err, result) => {
            if (err) {
                sqlerr(res, err);
                return;
            }
            let sql2 = `select count(*) as count from user where 1=1`
            if (isEmptyStr(username)) {
                sql2 += ` and username like '%${username}%'`
            }
            if (isEmptyStr(nickname)) {
                sql2 += ` and nickname like '%${nickname}%'`
            }
            db.query(sql2, (err, result2) => {
                if (err) {
                    sqlerr(res, err);
                    return;
                }
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

// 封禁解封管理员
router.put('/admin/status', (req, res) => {
    let { id, status } = req.body;
    if (id == 2) return tw(res, 403, '无法操作此账户');
    if (!isEmptyStr(id) || !isEmptyStr(status)) {
        tw(res, 400, '参数错误');
        return;
    }
    if (req.auth.role != 1) return tw(res, 403, '无权限');
    if (req.auth.id == id) return tw(res, 403, '无法操作自己');
    // status只能取值0和1
    if (status != 0 && status != 1) return tw(res, 400, '参数错误');
    let sql = `update user set status = ${status} where id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        let sta = status == 0 ? '解封' : '封禁';
        if (result.affectedRows === 1) {
            tw(res, 200, sta + '成功');
        } else {
            tw(res, 400, sta + '失败');
        }
    })
})

//添加管理员
router.post('/admin/add', (req, res) => {
    let { username, nickname } = req.body;
    if (!isEmptyStr(username) || !isEmptyStr(nickname)) return tw(res, 400, '参数错误');
    if (req.auth.role !== 1) return tw(res, 403, '无权限');
    let sql = `select * from user where username = '${username}'`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        if (result.length !== 0) {
            tw(res, 400, '用户名已存在');
            return;
        }
        let password = md5('123456')
        let status = 0;
        let role = 4;
        let sql = `insert into user (username,password,nickname,status,role,create_time,update_time) values ('${username}','${password}','${nickname}',${status},${role},now(),now())`;
        db.query(sql, (err, result) => {
            if (err) {
                sqlerr(res, err);
                return;
            }
            if (result.affectedRows === 1) {
                tw(res, 200, '添加成功，默认密码123456');
            } else {
                tw(res, 400, '添加失败');
            }
        });
    })
})

//修改密码
router.put('/admin/password', (req, res) => {
    let { newpass, oldpass } = req.body;
    if (req.auth.id == 2) return tw(res, 403, '无法操作此账户');
    if (!isEmptyStr(newpass) || !isEmptyStr(oldpass)) return tw(res, 400, '参数错误');
    //newpass只能是数字，字母，下划线，长度在6-22位
    let reg = /^[a-zA-Z0-9_]{4,22}$/;
    if (!reg.test(newpass)) return tw(res, 400, '新密码不合法')
    let newp = md5(newpass);
    let selectSql = `select password from user where id = ${req.auth.id}`;
    db.query(selectSql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        if (result.length === 0) return tw(res, 400, '用户不存在');
        if (result[0].password !== md5(oldpass)) return tw(res, 400, '原密码错误');
        if (result[0].password === newp) return tw(res, 400, '新密码不能与原密码相同')
        let sql = `update user set password = '${newp}',update_time=now() where id = ${req.auth.id}`;
        db.query(sql, (err, result) => {
            if (err) {
                sqlerr(res, err);
                return;
            }
            if (result.affectedRows === 1) {
                tw(res, 200, '修改成功');
            } else {
                tw(res, 400, '修改失败');
            }
        })
    })
})

//重置密码
router.post('/admin/reset', (req, res) => {
    let id = req.body.id;
    if (!isEmptyStr(id)) return tw(res, 400, '参数错误');
    if (req.auth.role !== 1) return tw(res, 403, '无权限');
    let password = md5('123456');
    let sql = `update user set password = '${password}',update_time=now() where id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        if (result.affectedRows === 1) {
            tw(res, 200, '重置成功，默认密码123456');
        } else {
            tw(res, 400, '重置失败');
        }
    })

})

//修改昵称
router.put('/admin/nickname', (req, res) => {
    let { nickname } = req.body;
    if (req.auth.id == 2) return tw(res, 403, '无法操作此账户');
    if (!isEmptyStr(nickname)) return tw(res, 400, '参数错误');
    if (nickname.length > 25) return tw(res, 400, '昵称长度不能超过25个字符')
    // 修改昵称和update_time
    let sql = `update user set nickname = '${nickname}',update_time=now() where id = ${req.auth.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        if (result.affectedRows === 1) {
            tw(res, 200, '修改成功');
        } else {
            tw(res, 400, '修改失败');
        }
    })
})

//删除管理员
router.delete('/admin/delete', (req, res) => {
    let id = req.query.id;
    if (!isEmptyStr(id)) return tw(res, 400, '参数错误');
    if (req.auth.role !== 1) return tw(res, 403, '无权限');
    if (req.auth.id == id) return tw(res, 403, '无法操作自己');
    if (req.auth.id == 2) return tw(res, 403, '无法操作此账户');
    let querySql = `select * from user where id = ${id}`;
    db.query(querySql, (err, result) => {
        if (err) return sqlerr(res, err);
        if (result[0].role == 1) return tw(res, 400, '无法删除超级管理员');
        if (result[0].role == 2) {
            //改管理员还是勾魂使者的情况
            let sql = `delete from reaper where uuid = '${result[0].username}'`;
            db.query(sql, (err, result) => {
                if (err) return sqlerr(res, err);
            })
        }
        let sql = `delete from user where id = ${id}`;
        db.query(sql, (err, result) => {
            if (err) {
                sqlerr(res, err);
                return;
            }
            if (result.affectedRows === 1) {
                tw(res, 200, '删除成功');
            } else {
                tw(res, 400, '删除失败');
            }
        })
    })
})

//将普通管理员设置为勾魂使者
router.put('/admin/reaper', (req, res) => {
    let { id, gender, description } = req.body;
    if (req.auth.id == 2) return tw(res, 403, '无法操作此账户');
    if (!isEmptyStr(id) || !isEmptyStr(gender) || !isEmptyStr(description)) return tw(res, 400, '参数错误');
    if (req.auth.role !== 1) return tw(res, 403, '无权限');
    if (id == 1) return tw(res, 400, '无法操作超级管理员');
    //gender只能是0或1
    if (gender != 0 && gender != 1) return tw(res, 400, '性别参数错误');
    let selectSql = `select * from user where id = ${id}`;
    db.query(selectSql, (err, result) => {
        if (err) return sqlerr(res, err);
        if (result.length === 0) return tw(res, 400, '用户不存在');
        if (result[0].role === 2) return tw(res, 400, '该用户已经是勾魂使者');
        let name = result[0].nickname;
        let uuid = result[0].username;
        let photo = '/public/def/photo.jpeg';
        let status = 0;
        //添加到勾魂使者表reaper
        let sql = `insert into reaper (name,uuid,gender,photo,description,create_time,role,status) values ('${name}','${uuid}',${gender},'${photo}',
    '${description}',now(),4,${status})`;

        db.query(sql, (err, result) => {
            if (err) return sqlerr(res, err);
            if (result.affectedRows === 1) {
                //修改user表中的role
                let sql = `update user set role = 2 where id = ${id}`;
                db.query(sql, (err, result) => {
                    if (err) return sqlerr(res, err);
                    if (result.affectedRows === 1) {
                        tw(res, 200, '设置成功');
                    } else {
                        tw(res, 400, '设置失败');
                    }
                })
            } else {
                tw(res, 400, '设置失败');
            }
        })
    })
})


module.exports = router;