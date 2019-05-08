module.exports = function(app) {
	var Web3 = require('web3')
		BigNumber = require('bignumber.js'),
		Tx = require('ethereumjs-tx'),
		stripHexPrefix = require('strip-hex-prefix');

	/* Web3 Initialization */
	const { WebsocketProvider } = Web3.providers
     const provider = new WebsocketProvider(app.web3.provider)
     
     var web3 = new Web3(provider); // Using Infura

	/* Contract initialization */
	var contractObj = new web3.eth.Contract(app.contract.abi, app.contract.address);
	contractObj.options.from = app.contract.owner_address;

	var nonceGlobal = 0;
	
	app.get('/test', function(req, res){
		return res.send({status: true, msg: 'this is a test!', data: nonceGlobal});
	});

	/* Transfer */
	app.post('/transfer', async function(req, res){
		if(!hasRights(req))
			return res.send({status: false, msg: 'you are not authorized!'});

		if(!req.body.address || !req.body.tokenAmount || isNaN(req.body.tokenAmount))
			return res.send({status: false, msg: 'invalid parameters!'});

		var address = req.body.address;
		//var tokenAmount = '"' + (req.body.tokenAmount * Math.pow(10, app.contract.decimals)) + '"'
		var adjusted = parseInt(req.body.tokenAmount)
		var tokenAmount = adjusted.toString() + "000000000000000000"

		var privateKeyString = stripHexPrefix(app.dist.privateKey);
		var privateKey = new Buffer(privateKeyString, 'hex');

		var gasPrice = new BigNumber(await web3.eth.getGasPrice());
		
		var nonce = await web3.eth.getTransactionCount(app.dist.address).catch((error) => {
			return res.send({status: false, msg: 'error occurred in getting transaction count!'});
		});

		if(nonceGlobal != 0 && nonceGlobal >= nonce)
			nonce = nonceGlobal + 1;

		nonceGlobal = nonce;

		var txData = contractObj.methods.transfer(address, tokenAmount).encodeABI();
		var txParams = {
			nonce: web3.utils.toHex(nonce),
			gasPrice: web3.utils.toHex(gasPrice),
			gasLimit: web3.utils.toHex(400000),
			from: app.dist.address,
			to: app.contract.address,
			value: '0x00',
			chainId: app.chainId,
			data: txData
		};

		var tx = new Tx(txParams);
		tx.sign(privateKey);

		var serializedTx = tx.serialize();

		web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
		.on('transactionHash', function(hash){
			console.log('hash - ' + hash);
			return res.send({status: true, hash: hash});
		}).on('error', function(err){
			console.log(err.message);
			return res.send({status: false, msg: err.message});
		}).on('receipt', function(res){
			console.log(res);
		});
	});

	function hasRights(req){
		var key = '';
		if(req.headers['x-api-key'])
			key = req.headers['x-api-key'];

		if(key != app.key)
			return false;
		return true;
	}
}