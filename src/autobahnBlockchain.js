const sha256 = require('sha256');

class Block {
    constructor(blockHeight, timestamp, nonce, prevBlockHash, hash, transactions) {
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = nonce;
        this.hash = hash;
        this.prevBlockHash = prevBlockHash;
    }
}

class AutobahnBlockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];

        this.createNewBlock(100, '0', 'Genesis block');
    }

    createNewBlock(nonce, prevBlockHash, hash) {
        const newBlock = new Block(
            this.chain.length + 1,
            Date.now(),
            nonce,
            prevBlockHash,
            hash,
            this.pendingTransactions
        );

        this.pendingTransactions = [];
        this.chain.push(newBlock);

        return newBlock;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    makeNewTransaction(amount, sender, recipient) {
        const transaction = {
            amount,
            sender,
            recipient
        }

        this.pendingTransactions.push(transaction);

        console.log(`------->>> Transaction amounting to ${amount} has been sent from ${sender} to ${recipient}`);

        return this.getLatestBlock().blockHeight + 1;
    }

    hashBlock(prevBlockHash, currentBlock, nonce) {
        const data = prevBlockHash + JSON.stringify(currentBlock) + nonce;
        const hash = sha256(data);
        return hash;
    }

    proofOfWork(prevBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);

        
        while (hash.substring(0, 4) !== '0000') {
            nonce++;
            hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        };

        return nonce;
    }

}
   
module.exports = AutobahnBlockchain;