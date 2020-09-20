"use strict";
var sha256 = require('sha256');
var Block = /** @class */ (function () {
    function Block(blockHeight, timestamp, nonce, prevBlockHash, hash, transactions) {
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = nonce;
        this.hash = hash;
        this.prevBlockHash = prevBlockHash;
    }
    return Block;
}());
var AutobahnBlockchain = /** @class */ (function () {
    function AutobahnBlockchain() {
        this.chain = [];
        this.pendingTransactions = [];
        this.createNewBlock(100, 'genesis', 'genesis');
    }
    AutobahnBlockchain.prototype.createNewBlock = function (nonce, prevBlockHash, hash) {
        var newBlock = new Block(this.chain.length + 1, Date.now(), nonce, prevBlockHash, hash, this.pendingTransactions);
        this.pendingTransactions = [];
        this.chain.push(newBlock);
        return newBlock;
    };
    AutobahnBlockchain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    AutobahnBlockchain.prototype.makeNewTransaction = function (amount, sender, recipient) {
        var transaction = {
            amount: amount,
            sender: sender,
            recipient: recipient
        };
        this.pendingTransactions.push(transaction);
        console.log("------->>> Transaction amounting to " + amount + " has been sent from " + sender + " to " + recipient);
        // this.getLatestBlock().blockHeight + 1;
        return this.getLatestBlock() + 1;
    };
    AutobahnBlockchain.prototype.getAllTransactions = function (address) {
        var allRelevantTransactions = [];
        this.chain.forEach(function (block) {
            block.transactions.forEach(function (transaction) {
                if (transaction.sender === address || transaction.recipient === address) {
                    allRelevantTransactions.push(transaction);
                }
            });
        });
        return allRelevantTransactions;
    };
    AutobahnBlockchain.prototype.getBalanceOfAllRelevantTransactions = function (address) {
        var totalBalance = 0;
        this.chain.forEach(function (block) {
            block.transactions.forEach(function (transaction) {
                if (transaction.sender === address || transaction.recipient === address) {
                    totalBalance += transaction.amount;
                }
            });
        });
        console.log('This is total balance', totalBalance);
        return totalBalance;
    };
    AutobahnBlockchain.prototype.getBlockByHeight = function (Height) {
        var currentBlock = [];
        this.chain.forEach(function (block) {
            if (block.blockHeight === Height) {
                currentBlock.push(block);
            }
        });
        return currentBlock;
    };
    AutobahnBlockchain.prototype.hashBlock = function (prevBlockHash, currentBlock, nonce) {
        var data = prevBlockHash + JSON.stringify(currentBlock) + nonce;
        var hash = sha256(data);
        console.log(' === > Hashing... ', hash);
        return hash;
    };
    AutobahnBlockchain.prototype.proofOfWork = function (prevBlockHash, currentBlockData) {
        var nonce = 0;
        var hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 2) !== '00') {
            nonce++;
            hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        }
        ;
        console.log(' === > proof of work ', nonce);
        return nonce;
    };
    return AutobahnBlockchain;
}());
module.exports = AutobahnBlockchain;
