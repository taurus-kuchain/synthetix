const { providers, Contract, Wallet, utils } = require('ethers');
const { currentTime } = require('../../test/utils')();

const abi = function(name) {
	return require('../../build/compiled/' + name + '.json').abi;
};

const address = function(name) {
	return require('../deployed/local/deployment').targets[name].address;
};

const provider = new providers.JsonRpcProvider('http://192.168.1.183:8545');
const privateKey = '0x5e6dff1276b3b05565cdc164ba734ff2a810c390b3196582ddbb126a331e6162';
const wallet = new Wallet(privateKey, provider);

const systemContract = new Contract(address('SystemSettings'), abi('SystemSettings'), provider);
const synthetixContract = new Contract(address('Synthetix'), abi('Synthetix'), provider);
const ExchangeRatesContract = new Contract(
	address('ExchangeRates'),
	abi('ExchangeRates'),
	provider
);

const synthetixWithSigner = synthetixContract.connect(wallet);
const ExchangeRatesWithSigner = ExchangeRatesContract.connect(wallet);
const systemWithSigner = systemContract.connect(wallet);

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
	const result = await synthetixWithSigner.balanceOf('0x21E3ACce64A61Cf7d0a68C67A7F02C67fB48C797');
	console.log('result -----', utils.formatEther(result));
}

async function transfer() {
	const result = await synthetixWithSigner.transfer(
		'0x6fD0E06Ce5bdfd2d1c0D06e822c03477FF0978f9',
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

//availableCurrencyKeys()
//totalIssuedSynths()
//rateForCurrency
//rateStalePeriod()
//setRateStalePeriod()
//balanceOf
//transfer
//issueSynths()
anyRateIsStale();
//updateRates()
//issuanceRatio()
//setIssuanceRatio()