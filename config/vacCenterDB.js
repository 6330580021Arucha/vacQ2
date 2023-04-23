const mysql = require("mysql");

var connection = mysql.createPool({
    host: 'Oak',
    user: 'root',
    password: 'Oakbymarwin2545',
    database: 'vacCenter'
});

module.exports = connection;