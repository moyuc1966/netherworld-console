const mysql = require('mysql')
const config = require('./config.js')


const db = mysql.createPool(config);
db.on("connection", connection => {
    connection.on("error", err => {
        console.error(new Date(), "MySQL error", err.code);
    });
    connection.on("close", err => {
        console.error(new Date(), "MySQL close", err);
    });
});
module.exports = db;





