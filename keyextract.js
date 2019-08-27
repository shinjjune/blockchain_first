var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

const keystore = {"address":"4877b511b8e9e19606235bbe2c76d07be48800be","crypto":{"cipher":"aes-128-ctr","ciphertext":"9ea786797e2b9456124cc67cb8e19a6cbac74831665ffef15adbb356c533043a","cipherparams":{"iv":"d36066b66f1f20b642f65bd1bc8377c3"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"66244af389dff31b9324b20b50b7904e9d12174d902197c4f21c58474df6fa43"},"mac":"d8c11f33435f858284ef211c9e36ce3782251f77a6cdc561547d77f6588563cd"},"id":"b22e905c-1168-4e6d-833b-133bd6f0ada4","version":3}
const decryptAccount = web3.eth.accounts.decrypt(keystore, 'eth');
console.log(decryptAccount.privateKey);

// 0x5ac6315a6c7750f0f039e6388a1cba7bca0df306223d54951eef2d60f1a6e507


var fromAddress = "0x4877b511b8e9e19606235bbe2c76d07be48800be";
var toAddress = "0x291b1a206615e5080d9bf4d66a1ea482c0fdcb66";
var amount = web3.utils.toHex(111111111);

async function sendTransaction(fromAddress, toAddress, amount) {
    var txPrams = {
        from : fromAddress,
        to : toAddress,
        value : amount,
        gas : web3.utils.toHex(0x21000)
    }
    
    var signedTx = await decryptAccount.signTransaction(txPrams);
    console.log(signedTx);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .once('transactionHash', (hash) => {
        console.log(hash);
    })
}


sendTransaction(fromAddress, toAddress, amount);