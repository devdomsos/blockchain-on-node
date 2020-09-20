"use strict";
var mongoose = require('mongoose');
require('dotenv').config();
var mongoDBname = process.env.MONGODB_NAME;

var autobahnBlockchainSchema = new mongoose.Schema({
    blockHeight: Number,
    timestamp: Number,
    transactions: [],
    hash: String,
    prevBlockHash: String,
}, { timestamps: true });
var AutobahnBlockchainModel = mongoose.model(mongoDBname, autobahnBlockchainSchema);
module.exports = AutobahnBlockchainModel;
