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

//格式化目录树
function formatDirectoryData(data) {
    const parentDirectories = data.filter((d) => d.isparent === 1);
    parentDirectories.forEach((parent) => {
        const children = data.filter((d) => d.parentid === parent.id);
        parent.children = children;
    });
    return parentDirectories;
}

//手动获取权限列表
router.get('/role/module', (req, res) => {
    if (req.auth.id != 1) return tw(res, 400, '您没有权限')
    if (!req.query.role) return tw(res, 400, '请选择角色')
    let id = req.query.role
    let querySql = `select module,name from role where id = ${id}`

    db.query(querySql, (err, result) => {
        if (err) return sqlerr(res, err)
        let module = result[0].module

        if (module == 'all') {
            let sql = `select * from module`
            db.query(sql, (err, result) => {
                if (err) return sqlerr(res, err)
                let sql = `select id from module`


                let arr = []
                result.forEach((item) => {
                    arr.push(item.id)
                })
                res.send({
                    'code': 200,
                    'msg': '获取成功',
                    'idList': arr.join(','),
                    'data': formatDirectoryData(result)
                })
            })
        } else {
            if (module.split(',').some(item => isNaN(Number(item.trim())))) return tw(res, 400, `${result[0].name}角色权限数据异常`)
            let sql = `select * from module where id in (${module})`
            db.query(sql, (err, result) => {
                if (err) return sqlerr(res, err)
                res.send({
                    'code': 200,
                    'msg': '获取成功',
                    'idList': module,
                    'data': formatDirectoryData(result)
                })
            })
        }
    })
})

// 获取登录人权限列表
router.get('/role', (req, res) => {
    let id = req.auth.role
    let querySql = `select module from role where id = ${id}`
    db.query(querySql, (err, result) => {
        if (err) return sqlerr(res, err)
        let module = result[0].module
        if (module == 'all') {
            let sql = `select * from module`
            db.query(sql, (err, result) => {
                if (err) return sqlerr(res, err)
                res.send({
                    'code': 200,
                    'msg': '获取成功',
                    'data': formatDirectoryData(result)
                })
            })
        } else {
            let sql = `select * from module where id in (${module})`
            db.query(sql, (err, result) => {
                if (err) return sqlerr(res, err)
                res.send({
                    'code': 200,
                    'msg': '获取成功',
                    'data': formatDirectoryData(result)
                })
            })
        }
    })
});



// 获取角色列表，返回角色内容和对应的权限名称
router.get('/role/list', (req, res) => {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 10;
    let start = (page - 1) * limit;
    let sql = `select * from role limit ${start},${limit}`
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err)
        let sql = `select * from module`
        db.query(sql, (err, result1) => {
            if (err) return sqlerr(res, err)
            result.forEach((item) => {
                let module = item.module.split(',')
                let arr = []
                module.forEach((item1) => {
                    result1.forEach((item2) => {
                        if (item1 == item2.id) {
                            arr.push(item2.name)
                        }
                        if (item1 == 'all') {
                            arr.push(item2.name)
                        }
                    })
                })
                item.module = arr.join(',')
            })
            let sql = `select count(*) as count from role`
            db.query(sql, (err, result2) => {
                if (err) return sqlerr(res, err)
                res.send({
                    'code': 200,
                    'msg': '获取成功',
                    'total': result2[0].count,
                    'data': result,
                })
            })
        })
    })
});


// 添加角色
router.post('/role/add', (req, res) => {
    let { name, module, description } = req.body;
    if (!isEmptyStr(name)) return tw(res, 400, '角色名不能为空')
    if (name == '最高管理员' || name == '勾魂使者' || name == '审判长' || name == '管理员') return tw(res, 400, '此角色不能添加')
    if (!isEmptyStr(module)) return tw(res, 400, '权限不能为空')
    let sql = `insert into role (name,module,description,create_time,update_time) values ('${name}','${module}','${description}',now(),now())`
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err)
        tw(res, 200, '添加成功')
    })
})

// 修改角色
router.put('/role/edit', (req, res) => {
    let { id, name, description, modules } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请选择要修改的数据')
    if (!isEmptyStr(name) && !isEmptyStr(modules) && !isEmptyStr(description)) return tw(res, 400, '请选择修改内容')
    if (id == '1' || id == '2' || id == '3' || id == '5') return tw(res, 400, '此角色不能修改')
    if ((name == '最高管理员' || name == '勾魂使者' || name == '审判长')) return tw(res, 400, '此名称不能重复')
    if (id == 4 && isEmptyStr(name) && name != '管理员') return tw(res, 400, '此角色不可修改角色名')
    //查询角色名称是否存在
    let sql = `select * from role where name = '${name}' and id != ${id}`
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err)
        if (result.length > 0) return tw(res, 400, '角色名称已存在')
        // 传入某项修改某项
        let arr = []
        let sql = `update role set `
        if (isEmptyStr(name)) arr.push(`name = '${name}'`)
        if (isEmptyStr(description)) arr.push(`description = '${description}'`)
        if (isEmptyStr(modules) && !modules.split(',').some(item => isNaN(Number(item.trim())))) arr.push(`module = '${modules}'`)
        sql += arr.join(',') + ` where id = ${id}`
        db.query(sql, (err, result) => {
            if (err) return sqlerr(res, err)
            tw(res, 200, '修改成功')
        })
    })
})


// 删除角色
router.delete('/role/del', (req, res) => {
    let { id } = req.query;
    if (!isEmptyStr(id)) return tw(res, 400, '请选择要删除的数据')
    if (id == '1' || id == '2' || id == '3' || id == '4' || id == '5') return tw(res, 400, '此角色不能删除')
    if (req.auth.role != 1) return tw(res, 403, '权限不足')
    // user表中所有role字段是id的都改为4
    let sql = `update user set role = 4 where role = ${id}`
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err)
        let sql = `delete from role where id = ${id}`
        db.query(sql, (err, result) => {
            if (err) return sqlerr(res, err)
            tw(res, 200, '删除成功')
        })
    })
})


//修改管理员角色
router.post('/role/admin', (req, res) => {
    let { id, role } = req.body;
    if (!isEmptyStr(id)) return tw(res, 400, '请选择要修改的数据')
    if (!isEmptyStr(role)) return tw(res, 400, '请选择修改内容')
    if (req.auth.id != 1) return tw(res, 403, '无权操作')
    if (id == 1) return tw(res, 400, '最高管理员不可修改')
    if (role == 2) return tw(res, 400, '不可直接设置勾魂使者')
    let sql = `update user set role = ${role} where id = ${id}`
    db.query(sql, (err, result) => {
        if (err) return sqlerr(res, err)
        tw(res, 200, '修改成功')
    })
})


module.exports = router;
