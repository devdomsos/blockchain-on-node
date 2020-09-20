"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
require('dotenv').config();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var AutobahnBlockchain = require('./autobahnBlockchain');
var AutobahnBlockchainModel = require('./database/model');
var mongoPath = process.env.MONGO_PATH;
var blocktimeconfig = process.env.BLOCK_TIME;
var txl = new AutobahnBlockchain();
// Connect to DB 
var connectToDB = function () {
    try {
        if (mongoPath === '') {
            throw new Error('Invalid or empty mongoURI provided');
        }
        var mongoOption = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        };
        mongoose.connect(mongoPath, mongoOption);
    }
    catch (err) {
        console.log('Error while connecting to mongodb', err.toString());
    }
    mongoose.connection.on('connected', function () {
        console.log('MongoDB connected!!');
    });
};
connectToDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// get entire blockchain
app.get('/', function (req, res) {
    res.send(txl);
});
app.get('/blockchain', function (req, res) {
    res.send(txl);
});
// create one transaction via endpoint
app.post('/createtransaction/', function (req, res) {
    var blockIndex = txl.makeNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({
        message: "Transaction has been added to block with the following index: " + blockIndex
    });
});
// query by address 
app.get('/getaddress/:MYADDRESS', function (req, res) {
    var userTypedAddress = req.params.MYADDRESS.toLocaleLowerCase();
    var allRelevantTransactions = txl.getAllTransactions(userTypedAddress);
    var theCurrentBalanceOfTransactions = txl.getBalanceOfAllRelevantTransactions(userTypedAddress);
    res.json({
        message: 'All relevant transactions obtained!',
        allRelevantTransactions: allRelevantTransactions,
        theCurrentBalanceOfTransactions: theCurrentBalanceOfTransactions
    });
});
// query by block height
app.get('/getblockheight/:BlockHeight', function (req, res) {
    var blockHeightInput = parseInt(req.params.BlockHeight);
    var blockHeight = txl.getBlockByHeight(blockHeightInput);
    res.json({
        message: 'BlockHeight successfully obtained!',
        blockHeight: blockHeight
    });
});
var randomNode = "miningNodeStradamus";
// manual proof of work
app.get('/mine', function (req, res) {
    var latestBlock = txl.getLatestBlock();
    var prevBlockHash = latestBlock.hash;
    var currentBlockData = {
        transactions: txl.pendingTransactions,
        index: latestBlock.index + 1
    };
    var nonce = txl.proofOfWork(prevBlockHash, currentBlockData);
    var blockHash = txl.hashBlock(prevBlockHash, currentBlockData, nonce);
    // reward for mining
    txl.makeNewTransaction(1, 'Genesis', randomNode);
    var newBlock = txl.createNewBlock(nonce, prevBlockHash, blockHash);
    var blockToBeSavedToDB = new AutobahnBlockchainModel(newBlock);
    blockToBeSavedToDB.save();
    res.json({
        message: 'New block has been mined successfully!',
        newBlock: newBlock
    });
});
// continuous proof of work
setInterval(function () {
    var runProofWork = function () {
        var latestBlock = txl.getLatestBlock();
        var prevBlockHash = latestBlock.hash;
        var currentBlockData = {
            transactions: txl.pendingTransactions,
            index: latestBlock.index + 1
        };
        var nonce = txl.proofOfWork(prevBlockHash, currentBlockData);
        var blockHash = txl.hashBlock(prevBlockHash, currentBlockData, nonce);
        // reward for mining
        txl.makeNewTransaction(1, '00000', randomNode);
        var newBlock = txl.createNewBlock(nonce, prevBlockHash, blockHash);
        var blockToBeSavedToDB = new AutobahnBlockchainModel(newBlock);
        blockToBeSavedToDB.save();
    };
    runProofWork();
}, blocktimeconfig);
app.listen(3000, function () {
    console.log('---> TXL AutobahnBlockchain is listening on port 3000...');
});
