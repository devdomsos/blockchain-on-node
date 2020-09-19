const mongoose = require('mongoose');
require('dotenv').config();

const mongoDBname = process.env.MONGODB_NAME;
// export interface Block {
//     transactions: string[]
//     timestamp: number;
//     prev: string;
//     hash: string;
//     height: number;
// }

// this.blockHeight = blockHeight;
// this.timestamp = timestamp;
// this.transactions = transactions;
// this.nonce = nonce;
// this.hash = hash;
// this.prevBlockHash = prevBlockHash;

const autobahnBlockchainSchema = new mongoose.Schema({
	
    blockHeight : Number,
    timestamp: Number,
    transactions: [],
    hash: String,
	prevBlockHash: String,
}, { timestamps: true });

const AutobahnBlockchainModel = mongoose.model(mongoDBname, autobahnBlockchainSchema);

module.exports  = AutobahnBlockchainModel ;