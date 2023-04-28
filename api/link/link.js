const mysql = require('mysql')
const config = require('./config.js')
let db = mysql.createConnection(config)

if (!db) {
    let err = new Error();
    err.message = '数据库链接失败';
    err.status = 1054;
    err.name = 'DatabaseError';
    throw err;
}
//当连接关闭时，查询连接
process.on('uncaughtException', function (err) {
    if (err) {
        let db = mysql.createConnection(config)
        mysql.restart();
    }
});
process.on('uncaughtException', function (err) {
    if (err.code == "PROTOCOL_CONNECTION_LOST") {
        mysql.restart();
    }
});


module.exports = db;




