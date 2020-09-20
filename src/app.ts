import express, {Request, Response} from 'express'
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AutobahnBlockchain = require('./autobahnBlockchain');
const AutobahnBlockchainModel = require('./database/model');

declare var process : {
    env: {
        MONGO_PATH: string,
        BLOCK_TIME: number
    }
  }
const mongoPath = process.env.MONGO_PATH;
const blocktimeconfig:number | undefined = process.env.BLOCK_TIME;
const txl = new AutobahnBlockchain();

// Connect to DB 
const connectToDB = () => {
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
// get entire blockchain
app.get('/', (req: Request, res: Response) => {
    res.send(txl);
});
app.get('/blockchain', (req: Request, res: Response) => {
    res.send(txl);
});

// create one transaction via endpoint
app.post('/createtransaction/', (req: Request, res: Response) => {
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

// query by address 
app.get('/getaddress/:MYADDRESS', (req: Request, res: Response) => {
    let userTypedAddress = req.params.MYADDRESS.toLocaleLowerCase();
    let allRelevantTransactions = txl.getAllTransactions(userTypedAddress)
    let theCurrentBalanceOfTransactions = txl.getBalanceOfAllRelevantTransactions(userTypedAddress)
    res.json(
        {
            message: 'All relevant transactions obtained!',
            allRelevantTransactions,
            theCurrentBalanceOfTransactions
        }
    );
})

// query by block height
app.get('/getblockheight/:BlockHeight', (req: Request, res: Response) =>{
       let blockHeightInput = parseInt(req.params.BlockHeight);
       let  blockHeight = txl.getBlockByHeight(blockHeightInput)
    res.json(
        {
            message: 'BlockHeight successfully obtained!',
            blockHeight
            
        }
    );
})

const randomNode = "miningNodeStradamus"

// manual proof of work
app.get('/mine', (req: Request, res: Response) =>  {
    const latestBlock = txl.getLatestBlock();
    const prevBlockHash = latestBlock.hash;
    const currentBlockData = {
        transactions: txl.pendingTransactions,
        index: latestBlock.index + 1
    }
    const nonce = txl.proofOfWork(prevBlockHash, currentBlockData);
    const blockHash = txl.hashBlock(prevBlockHash, currentBlockData, nonce);
 
    // reward for mining
    txl.makeNewTransaction(1, 'Genesis', randomNode);
 
    const newBlock = txl.createNewBlock(nonce, prevBlockHash, blockHash)
    const blockToBeSavedToDB = new AutobahnBlockchainModel(newBlock);
    blockToBeSavedToDB.save();
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