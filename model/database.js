'use strict';

const mysql = require('mysql');

// To connect database (mySQL)
// NOT work initial way (const mysql = mysql.createConnection({}))
// That is why it is used by POOL

// Create MySQL Database via HEROKU (ClearDB)
const pool = mysql.createPool({
    host: 'us-cdbr-iron-east-03.cleardb.net',
    user: 'b51b7ab0cc7507',
    password: '2469535e',
    database: 'heroku_972eca15864c790'
});

/* When I create the record table, I set the hashcode as Primary Key to prevent duplicating */
module.exports.insertData = (txs) => {
    return new Promise((resolve, reject) => { // Asynchronous (resolve -> then) (reject -> catch)
        var sql = 'INSERT INTO record (HASHCODE) VALUES(?)'; // Just only receive HASHCODE value from BlockCypher API
        var params = txs.hash;
        pool.query(sql, params, function(err, rows, fields){
            if(err){
                reject(err);
            }
            else{
                resolve("Inserted");
            }
        })
    })
};

module.exports.showData = () => {
    return new Promise((resolve, reject) => { // Asynchronous (resolve -> then) (reject -> catch)
        var sql = 'SELECT * FROM record';
        pool.query(sql, function(err, rows, fields){
        if(err){
            reject(err);
        }
        else{
            // As long as I put resolve(rows) -> The data is wrapped by RowDataPacket
            // In order to avoid it, I need to use JSON.parse(JSON.stringify) to replace the data with JSON data type
            // It is called 'Hacky solution'
            resolve(JSON.parse(JSON.stringify(rows)));
        }
        })
    })
};