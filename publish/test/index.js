const { providers, Contract, Wallet, utils } = require('ethers');
const { currentTime } = require('../../test/utils')();

const abi = function(name) {
	return require('../../build/compiled/' + name + '.json').abi;
};

const address = function(name) {
	return require('../deployed/local/deployment').targets[name].address;
};

const provider = new providers.JsonRpcProvider('http://192.168.1.105:8545');
const privateKey = '0xbced0c57065c2cf3b004c4d793949ef19fccd4697c39af6c9b5f6fa69150159a';
const wallet = new Wallet(privateKey, provider);

const systemContract = new Contract(address('SystemSettings'), abi('SystemSettings'), provider);
const synthetixContract = new Contract(address('Synthetix'), abi('Synthetix'), provider);
const synthetixStateContract = new Contract(
	address('SynthetixState'),
	abi('SynthetixState'),
	provider
);
const ExchangeRatesContract = new Contract(
	address('ExchangeRates'),
	abi('ExchangeRates'),
	provider
);

const synthetixWithSigner = synthetixContract.connect(wallet);
const ExchangeRatesWithSigner = ExchangeRatesContract.connect(wallet);
const systemWithSigner = systemContract.connect(wallet);
const synthetixStateWithSigner = synthetixStateContract.connect(wallet);

async function availableCurrencyKeys() {
	const result = await synthetixWithSigner.availableCurrencyKeys();
	result.forEach((v, i) => console.log('result -----', utils.parseBytes32String(v)));
}

async function totalIssuedSynths() {
	const result = await synthetixWithSigner.totalIssuedSynths();
	console.log('result -----', result);
}

async function rateForCurrency() {
	const result = await ExchangeRatesWithSigner.rateForCurrency(utils.formatBytes32String('sBTC'));
	console.log('result -----', utils.formatEther(result));
}

async function setRateStalePeriod() {
	const result = await systemWithSigner.setRateStalePeriod(10000000000);
	console.log('result -----', result);
}

async function rateStalePeriod() {
	const result = await ExchangeRatesWithSigner.rateStalePeriod();
	console.log('result -----', result.toNumber());
}

async function balanceOf() {
	const result = await synthetixWithSigner.balanceOf('0x16c77205ffa3c66a2805469a1c800c164c2aaff5');
	console.log('result -----', utils.formatEther(result));
}

async function transfer() {
	const result = await synthetixWithSigner.transfer(
		'0x3b6d52282b4b602a8dd0096ed2e029bd1f16b262',
		10000000
	);
	console.log('result -----', result);
}

async function issueSynths() {
	const result = await synthetixWithSigner.issueSynths(100);
	console.log('result -----', result);
}

async function anyRateIsStale() {
	const result = await ExchangeRatesWithSigner.anyRateIsStale([
		utils.formatBytes32String('SNX'),
		utils.formatBytes32String('sETH'),
		utils.formatBytes32String('sBTC'),
	]);
	console.log('result -----', result);
}

async function updateRates() {
	const oracle = await ExchangeRatesWithSigner.oracle();
	console.log('oracle--------', oracle);

	const now = await currentTime();
	console.log('now--------', now);

	const result = await ExchangeRatesWithSigner.updateRates(
		[
			utils.formatBytes32String('SNX'),
			utils.formatBytes32String('sETH'),
			utils.formatBytes32String('sBTC'),
		],
		[500000000000, 500000000, 500000000],
		now
	);
	console.log('result -----', result);
}

async function issuanceRatio() {
	const result = await systemWithSigner.issuanceRatio();
	console.log('result -----', utils.formatEther(result));
}

async function setIssuanceRatio() {
	const result = await systemWithSigner.setIssuanceRatio(1000000000000000);
	console.log('result -----', result);
}

async function stateIssuanceRatio() {
	const result = await synthetixStateWithSigner.issuanceRatio();
	console.log('result -----', result);
}

async function collateralisationRatio() {
	const result = await synthetixWithSigner.collateralisationRatio('0x16c77205ffa3c66a2805469a1c800c164c2aaff5');
	console.log('result -----', result);
}

async function getEthBlance() {
	provider.getBalance('0x16c77205ffa3c66a2805469a1c800c164c2aaff5').then((balance) => {

		// 余额是 BigNumber (in wei); 格式化为 ether 字符串
		let etherString = utils.formatEther(balance);

		console.log('Balance: ' + etherString);
	});
}

async function getNetwork() {
	const result = await provider.getBlock();
	console.log('result -----', result);
}

//availableCurrencyKeys()
//totalIssuedSynths()
//rateForCurrency
//rateStalePeriod()
//setRateStalePeriod()
//balanceOf
//transfer
//issueSynths()
//anyRateIsStale();
//updateRates()
//issuanceRatio()
//setIssuanceRatio()
//stateIssuanceRatio()
//collateralisationRatio()
//getEthBlance();
getNetwork()