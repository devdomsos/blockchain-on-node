const sha256 = require('sha256');


class Block {
    constructor (index, prevBlockHash, currentHash, timestamp, transactionData, nonce) {
        this.index = index;
        this.prevBlockHash = prevBlockHash;
        this.currentHash = currentHash;
        this.timestamp = timestamp;
        this.transactionData = transactionData;
        this.nonce = nonce
    }
}

class AutobahnBlockchain {
    constructor () {
        this.chain = [];
        this.pendingTrx = [];

        this.createNewBlock(50, '0', 'Genesis Block' )
    }

    createNewBlock(prevBlockHash, currentHash, nonce) {
        const newBlock = new Block(
            this.chain.length + 1,
            prevBlockHash,
            currentHash,
            Date.now() / 1000,
            this.pendingTrx,
            nonce
        );
        this.pendingTrx = [];
        this.chain.push(newBlock)
    }

    createNewTransaction(sender, recipient, amount){
        const transaction = {
            sender,
            recipient,
            amount
        }
        this.pendingTrx.push(transaction)

        console.log(`>> Transaction: ${amount} from ${sender} to ${recipient} `)

        return this.getLatestBlock().index + 1
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    } 

    hashBlock(prevBlockHash, currentBlockInfo, nonce) {
        const data = prevBlockHash + JSON.stringify(currentBlockInfo) + nonce;
        const hash = sha256(data);
        return hash;
    }

}

