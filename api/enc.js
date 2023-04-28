const md5 = require('md5')

const enc = function (pass) {
    const result = "moyc^_^" + pass;
    let m = md5(result)
    return m;
}

module.exports = enc