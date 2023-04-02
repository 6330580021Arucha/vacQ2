const mysql = require("mysql");

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Oakbymarwin2545',
    database: 'vacCenter'
});

module.exports = connection;