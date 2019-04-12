/* ********************************************************************

Title : BlockCypher API
Name : Sungjun Hong
Created : April 12, 2019

*********************************************************************** */

'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const bitcoin = require('bitcoinjs-lib');
const db = require('../model/database');
const testnet = bitcoin.networks.testnet;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Generate virtual wallet */
app.get('/api/generateWallet', (req, res) => {
    
    let keypair = bitcoin.ECPair.makeRandom({network:testnet});
    let addr = keypair.getAddress(); // Generate Public Address for virtual wallet
    let pk = keypair.toWIF(); // Generate Private Key for virtual wallet

    let data = {
        "address" : addr,
        "pk" : pk
    };

    res.json(data); // Send the data (including virtual wallet information to frontend page to show)
});

/* Through the bitcoinjs module, create the transaction (need to set from and to address) and generate hex code */
app.post('/api/payment', (req, res) => {

    let txb = new bitcoin.TransactionBuilder(testnet);
    let txid = req.body.hash; // hash (transaction ID)
    let outn = 0; // n value
    
    // input
    txb.addInput(txid, outn);
    
    // output
    txb.addOutput(req.body.payToAddress, parseInt(req.body.amount)); // First parameter means the toAddress , Second parameter means amount (Make it less than balance)
    
    let WIF = req.body.pk;
    let keypairSpend = bitcoin.ECPair.fromWIF(WIF, testnet);
    
    txb.sign(0, keypairSpend);
    
    let tx = txb.build();
    let txhex = tx.toHex(); // Generate hex code
    
    res.send(txhex); // Send hex code to frontend page
    // alert(txhex + "     Go to https://live.blockcypher.com/btc-testnet/pushtx/ and put the hex code");
    
});

/* By using BlockCypher API, once having an access to address, receive the data (Particularly, txs information) */
app.post('/api/addDatabase', (req, res) => {
    fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${req.body.addr}/full`).then((data) => {
        data.json().then((result) => {
            for(var i=0; i<result.txs.length; i++){ // As much as the number of txs, the data will be stored in MySQL
                db.insertData(result.txs[i]).then((msg) => {
                    console.log(msg);
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }).catch((err) => {
        console.log(err);
    })
});

/* Once I receive the data from MySQL (transaction record), send the data to frontend page */
app.get('/api/showDatabase', (req, res) => {
    db.showData().then((rows) => {
        res.json(rows); // This ! (Receive this data through axios from frontend page)
    }).catch((err) => {
        console.log(err);
    })
});

app.listen(port, () => {
    console.log(`Connected ${port}`);
});

/* Another Trial */

// create transaction
// var bitcoinTransaction = require('bitcoin-transaction');

// Send all my money from wallet1 to wallet2 on the bitcoin testnet
// var from = "msxU8PEQH3pzyNwyQRKr7CVUdJyZgsMvWB";
// var to = "mtNUEkJDWZXfz465VX4sELzruxnEcvTTq9";
// var privKeyWIF = "91rJTesL1gcsFCJKdQHdXsYyvvCSxgpiKhG1E3iqFXos7ZKfKEM";	// Private key in WIF form (Can generate this from bitcoinlib-js)

// bitcoinTransaction.getBalance(from, { network: "testnet" }).then((balanceInBTC) => {
//  console.log(balanceInBTC); // Check the balance via console
// 	return bitcoinTransaction.sendTransaction({
// 		from: from,
// 		to: to,
// 		privKeyWIF: privKeyWIF,
// 		btc: 0.02111111,
// 		network: "testnet"
// 	});
// }).catch((err) => {
//     console.log(err);
// });