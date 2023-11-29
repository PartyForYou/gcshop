// 201935222 김민석
var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'webdb2023',
    multipleStatements: true
})
db.connect();
module.exports = db;