const AutobahnBlockchain = require('../src/autobahnBlockchain');

function mine(blockChain) {
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
    blockChain.makeNewTransaction(1, '00000', 'miningNodeStradamus');

    console.log('--->>> Create new Block:\n', blockChain.createNewBlock(nonce, prevBlockHash, blockHash));
}

const txl = new AutobahnBlockchain();
console.log('--->>> Create new Blockchain:\n', txl);

txl.makeNewTransaction(120, 'Angie McAngular', 'Geo Lo Cation');

mine(txl);

txl.makeNewTransaction(1120, 'Jay Query', 'Json Babel');
txl.makeNewTransaction(300, 'Ecma Scriptnstuff', 'Angie McAngular');
txl.makeNewTransaction(2700, 'Json Babel', 'Jay Query');

mine(txl);

console.log('>>> Current Blockchain Data:\n', txl);
