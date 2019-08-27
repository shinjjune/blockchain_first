var Web3 = require('web3');
var web3 = new Web3('https://mainnet.infura.io');

web3.eth.getBlockNumber()
    .then(number => {
    console.log(number);
});

web3.eth.getBlock(8430167)
    .then(block => {
        console.log(block);
    })


