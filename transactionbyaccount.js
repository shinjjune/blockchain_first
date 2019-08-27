var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

async function getTransactionByAccount(myaccount, startBlockNumber, endBlockNumber) {
    console.log('Transaction By Account');
    console.log('Account : ', myaccount);
    console.log('Block : ', startBlockNumber, ' - ', endBlockNumber);

    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
        let block = await web3.eth.getBlock(i);
        // if(block.transactions.length > 0) {
        //     console.log(block);

        //     break;
        // }

        if (block != null && block.transactions != null) {
            block.transactions.forEach(async (el) => {
                var tx = await web3.eth.getTransaction(el);
                console.log(tx);
                console.log("___________________________________");
                if(myaccount == el.from || myaccount == el.to) {
                console.log(" tx hash: ", tx.hash);
                console.log(" nonce : ", tx.nonce);
                console.log(" blocknumber : ", tx.blockNumber);
                console.log(" from : ", tx.from);
                console.log(" to : ", tx.to);
                }
            })
        }
    }
}


getTransactionByAccount("0x4877b511b8e9e19606235bbe2c76d07be48800be", 0, 123);