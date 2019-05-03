var bodyParser = require('body-parser');
var express = require('express');

// Config
var config = require("./config/setting.js");

var app = express();

// Web3 configuration
app.web3 = config.web3;

// Contract configuration
app.contract = {};
app.contract.abi = require("./app/resources/" + config.contract.abi);
app.contract.address = config.contract.address;
app.contract.owner_address = config.contract.owner_address;
app.contract.password = config.contract.password;
app.contract.decimals = config.contract.decimals;

// Distribute configuration
app.dist = {};
app.dist.address = config.dist.address;
app.dist.privateKey = config.dist.privateKey;
// Bot configuration
app.bot1 = config.bot1;
app.bot2 = config.bot2;
// Chain ID configuration
app.chainId = config.chainId;

// App key
app.key = config.key;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

require('./app/routes/api')(app);

app.listen(3000, function(){
	console.log(`Listening at http://localhost:3000`)
});