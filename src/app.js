const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AutobahnBlockchain = require('../src/autobahnBlockchain');
const AutobahnBlockchainModel = require('../src/database/model');


const mongoPath = process.env.MONGO_PATH;
const blocktimeconfig = process.env.BLOCK_TIME;
const txl = new AutobahnBlockchain();

// Connect to DB 
const connectToDB = async () => {
    try {
		if (mongoPath === '') {
			throw new Error('Invalid or empty mongoURI provided');
		}

		const mongoOption = {
			useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
		};

		 mongoose.connect(
			mongoPath,
			mongoOption,
		);
	} catch (err) {
		console.log('Error while connecting to mongodb', err.toString());
    }
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected!!')
    })

}
connectToDB()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(txl);
});
 
app.get('/blockchain', (req, res) => {
    res.send(txl);
});

app.post('/createTransaction/', (req, res) => {
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

const randomNode = "JSONBabel"

// manual proof of work
app.get('/mine', (req, res) =>  {
    const latestBlock = txl.getLatestBlock();
    const prevBlockHash = latestBlock.hash;
    const currentBlockData = {
        transactions: txl.pendingTransactions,
        index: latestBlock.index + 1
    }
    const nonce = txl.proofOfWork(prevBlockHash, currentBlockData);
    const blockHash = txl.hashBlock(prevBlockHash, currentBlockData, nonce);
 
    // reward for mining
    txl.makeNewTransaction(1, '00000', randomNode);
 
    const newBlock = txl.createNewBlock(nonce, prevBlockHash, blockHash)
    res.json(
        {
            message: 'New block has been mined successfully!',
            newBlock
        }
    );
});

// continuous proof of work
setInterval( () => {
    const runProofWork = () => {
        const latestBlock = txl.getLatestBlock();
        const prevBlockHash = latestBlock.hash;
        const currentBlockData = {
            transactions: txl.pendingTransactions,
            index: latestBlock.index + 1
        }
        const nonce = txl.proofOfWork(prevBlockHash, currentBlockData);
        const blockHash = txl.hashBlock(prevBlockHash, currentBlockData, nonce);
     
        // reward for mining
        txl.makeNewTransaction(1, '00000', randomNode);
     
        const newBlock = txl.createNewBlock(nonce, prevBlockHash, blockHash)

        const blockToBeSavedToDB = new AutobahnBlockchainModel(newBlock);
        blockToBeSavedToDB.save();
    }
   
    runProofWork ()
   
}, blocktimeconfig)

 
app.listen(3000, function () {
    console.log('---> TXL AutobahnBlockchain is listening on port 3000...');
});