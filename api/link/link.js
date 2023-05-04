const mysql = require('mysql')
const config = require('./config.js')

let db;
function connectToDB() {
    db = mysql.createConnection(config);
    db.connect(function (err) {
        if (err) {
            // handle connection error
            console.error('Error connecting to database:', err);
            setTimeout(connectToDB, 2000); // try again in 2 seconds
        } else {
            // 数据库连接成功
            // console.log('Connected to database');
        }
    });

    db.on('error', function (err) {
        // handle connection error
        console.error('数据库 error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            connectToDB(); // reconnect
        }
    });
}

connectToDB();

process.on('uncaughtException', function (err) {
    if (err) {
        // handle uncaught exception
        console.error('Uncaught exception:', err);
        db.end(function () {
            connectToDB(); // restart connection
        });
    }
});
// let db = mysql.createConnection(config)

// if (!db) {
//     let err = new Error();
//     err.message = '数据库链接失败';
//     err.status = 1054;
//     err.name = 'DatabaseError';
//     throw err;
// }
// //当连接关闭时，查询连接
// process.on('uncaughtException', function (err) {
//     if (err) {
//         let db = mysql.createConnection(config)
//         mysql.restart();
//     }
// });
// process.on('uncaughtException', function (err) {
//     if (err.code == "PROTOCOL_CONNECTION_LOST") {
//         mysql.restart();
//     }
// });


module.exports = db;




