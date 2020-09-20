const sha256 = require('sha256');

interface Block {
    blockHeight: number;
    timestamp: number;
    transactions: Array<string | number | object>
    nonce: number;
    prev: string;
    hash: string;
    prevBlockHash: string;
}

interface AutobahnBlockchain {
    chain: string[],
    pendingTransactions: string[]
}

class Block {
    constructor(blockHeight:number, 
                timestamp: number, 
                nonce: number, 
                prevBlockHash: string, 
                hash: string, 
                transactions:string[]) 
        {
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

        this.createNewBlock(100, 'genesis', 'genesis');
    }

    createNewBlock(nonce: number, prevBlockHash: string, hash: string){
        const newBlock:any = new Block(
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

    makeNewTransaction(amount:number, sender:string, recipient:string) {
        const transaction:any = {
            amount,
            sender,
            recipient
        }

        this.pendingTransactions.push(transaction);

        console.log(`------->>> Transaction amounting to ${amount} has been sent from ${sender} to ${recipient}`);
        // this.getLatestBlock().blockHeight + 1;
        
        return this.getLatestBlock() + 1;
    }

    getAllTransactions(address:string){
        const allRelevantTransactions:string[] = [];
        this.chain.forEach( (block:any) => {
            block.transactions.forEach( (transaction:any) => {
                if (transaction.sender === address || transaction.recipient === address ){
                    allRelevantTransactions.push(transaction)
                } 
               
            })
        })
        return allRelevantTransactions;
    }

    getBalanceOfAllRelevantTransactions(address:string) {
        let totalBalance = 0
        this.chain.forEach( (block:any) => {
            block.transactions.forEach( (transaction:any) => {
                if (transaction.sender === address || transaction.recipient === address ){
                    totalBalance += transaction.amount;
                } 
            })
        })
        console.log('This is total balance', totalBalance)
        return totalBalance
    }

    getBlockByHeight(Height:number){
        let currentBlock:any[] = [];
        this.chain.forEach( (block:any) => {
            if (block.blockHeight === Height){
                currentBlock.push(block)
            }        
        })
        return currentBlock;
    }
    

    hashBlock(prevBlockHash:string, currentBlock:object, nonce:number) {
        const data = prevBlockHash + JSON.stringify(currentBlock) + nonce;
        const hash = sha256(data);
        console.log(' === > Hashing... ', hash)
        return hash;
    }
    
    proofOfWork(prevBlockHash:string, currentBlockData:object) {
        let nonce = 0;
        let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);

        
        while (hash.substring(0, 2) !== '00') {
            nonce++;
            hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        };
    
        console.log(' === > proof of work ', nonce)
        return nonce;


    }
   
}
   
module.exports = AutobahnBlockchain;