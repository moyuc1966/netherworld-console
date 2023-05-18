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

//数据统计
router.get('/statistics', (req, res) => {
    //统计数据包含：生死簿数量，待勾魂数量，今天入府数量，受刑总数
    let sql = `select 
    (select count(*) from lifebook) as lifebook_count, 
    (select count(*) as count from lifebook where deathday between curdate() and date_add(curdate(),interval 30 day)) as enchant, 
    (SELECT COUNT(*) FROM lifebook WHERE DATE(deathday) = CURDATE()) as today_count, 
    (select count(*) from lifebook where status = 4) as punished`;

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
})

// 获取七天内死亡数量变化曲线
router.get('/getDeathCount', (req, res) => {
    //查询lifebook表中，deathday在今天到今天减7天之内的7个数据，同一天的数据合并，数据不包括今天
    let sql = `SELECT DATE(deathday) AS date, COUNT(*) AS count FROM lifebook 
            WHERE deathday BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() GROUP BY DATE(deathday) 
            ORDER BY date DESC`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        res.send({
            'code': 200,
            'msg': '获取成功',
            'data': result
        })
    })
})

//获取七天内受刑情况变化曲线
router.get('/getPunishedCount', (req, res) => {
    let sql = `SELECT DATE(create_time) AS date, COUNT(*) AS count FROM helllog 
        WHERE create_time BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() 
        GROUP BY DATE(create_time) ORDER BY date DESC`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        res.send({
            'code': 200,
            'msg': '获取成功',
            'data': result
        })
    })
})

//获取七天内轮回数量变化曲线
router.get('/getReincarnationCount', (req, res) => {
    let sql = `SELECT DATE(create_time) AS date, COUNT(*) AS count FROM reincarnationlog 
        WHERE create_time BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() 
        GROUP BY DATE(create_time) ORDER BY date DESC`;
    db.query(sql, (err, result) => {
        if (err) {
            sqlerr(res, err);
            return;
        }
        res.send({
            'code': 200,
            'msg': '获取成功',
            'data': result
        })
    })
})


module.exports = router;