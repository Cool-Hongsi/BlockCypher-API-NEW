'use strict';

const mysql = require('mysql');

// To connect database (mySQL)
// NOT work initial way (const mysql = mysql.createConnection({}))
// That is why it is used by POOL

// Create MySQL Database via HEROKU (ClearDB)
const pool = mysql.createPool({
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'b2a3e1f06f6fc1',
    password: 'ff8d8faf',
    database: 'heroku_d4b72c20aba5285'
});

/* When I create the record table, I set the hashcode as Primary Key to prevent duplicating */
module.exports.insertData = (txs) => {
    return new Promise((resolve, reject) => { // Asynchronous (resolve -> then) (reject -> catch)
        var sql = 'INSERT INTO record (HASHCODE, FROMPUBADD, TOPUBADD, AMOUNT, FEE) VALUES(?, ?, ?, ?, ?)';

        if(txs.inputs[0].witness){ // First transaction with testnet bitcoin faucet
            var params = [txs.hash, "Bitcoin Testnet Faucet", txs.outputs[0].addresses[0], txs.total, txs.fees];
        }
        else{
            var params = [txs.hash, txs.inputs[0].addresses[0], txs.outputs[0].addresses[0], txs.total, txs.fees];
        }
        
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