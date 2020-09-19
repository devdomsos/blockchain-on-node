const AutobahnBlockchain = require('../src/autobahnBlockchain');
const minerAddress = 'miningNodeStradamus'




const mine = (blockChain) => {
    console.log('--->>> Mining in progress...');

    const latestBlock = blockChain.getLatestBlock();
    const prevBlockHash = latestBlock.hash;
    const currentBlockData = {
        transactions: blockChain.pendingTransactions,
        index: latestBlock.index + 1
    }
    const nonce = blockChain.proofOfWork(prevBlockHash, currentBlockData);
    const blockHash = blockChain.hashBlock(prevBlockHash, currentBlockData, nonce);

    // reward for mining
    blockChain.makeNewTransaction(1, 'Genesis', minerAddress);

    console.log('--->>> Create new Block:\n', blockChain.createNewBlock(nonce, prevBlockHash, blockHash));
}

const txl = new AutobahnBlockchain();
console.log('--->>> Create new Blockchain:\n', txl);

txl.makeNewTransaction(120, 'AngieMcAngular', 'GeoLoCation');

mine(txl);

txl.makeNewTransaction(1120, 'JayQuery', 'JsonBabel');
txl.makeNewTransaction(300, 'EcmaScriptnstuff', 'AngieMcAngular');
txl.makeNewTransaction(200, 'JsonBabel', 'JayQuery');

mine(txl);

console.log('>>> Current Blockchain Data:\n', txl);