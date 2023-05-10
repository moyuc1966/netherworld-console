let config = {
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'afterlifedb',
    timezone: "SYSTEM",
    connectionLimit: 10 // 控制连接池的大小为 10 个连接
}

module.exports = config;