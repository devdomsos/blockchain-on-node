const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
 

 
const AutobahnBlockchain = require('../src/autobahnBlockchain');
const txl = new AutobahnBlockchain();

app.get('/', function (req, res) {
    res.send(txl);
});
 
app.get('/blockchain', function (req, res) {
    res.send(txl);
});

app.post('/transaction', function (req, res) {
    const blockIndex = txl.makeNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    );
 
    res.json(
        {
            message: `Transaction has been added to block with the following index: ${blockIndex}`
        }
    );
});

 
app.listen(3000, function () {
    console.log('---> listening on port 3000...');
});