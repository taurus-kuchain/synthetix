const { providers, Contract, Wallet, utils } = require('ethers');
const { currentTime } = require('../../test/utils')();

const abi = function(name) {
	return require('../../build/compiled/' + name + '.json').abi;
};

var address = {
	Synthetix: '0x2a5B2fE7A96020b378b98245709Ffa4C35498145',
	ExchangeRates: '0xEBeb2Cc78f94EB10cBf3a46481A5fA26603F734F',
	SystemSettings: '0xF383D0a290ED9FF7Cc3c0c78472681ffE0572129',
};

const provider = new providers.JsonRpcProvider('http://localhost:8545');
const privateKey = '0x623bfea4fcd355f3a060f585902a0c4d88ee1777b6b0c8eaf81c3acd63ce28c1';
const wallet = new Wallet(privateKey, provider);

const systemContract = new Contract(address['SystemSettings'], abi('SystemSettings'), provider);
const synthetixContract = new Contract(address['Synthetix'], abi('Synthetix'), provider);
const ExchangeRatesContract = new Contract(
	address['ExchangeRates'],
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
	const result = await synthetixWithSigner.balanceOf('0xBCf96DBb558460C6f027dDD37bDFbC50577Fa0A4');
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
//anyRateIsStale();
updateRates()
//issuanceRatio()
//setIssuanceRatio()