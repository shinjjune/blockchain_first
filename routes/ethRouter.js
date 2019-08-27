var express = require('express');
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

var router = express.Router();

const keystore = { "address": "4877b511b8e9e19606235bbe2c76d07be48800be", "crypto": { "cipher": "aes-128-ctr", "ciphertext": "9ea786797e2b9456124cc67cb8e19a6cbac74831665ffef15adbb356c533043a", "cipherparams": { "iv": "d36066b66f1f20b642f65bd1bc8377c3" }, "kdf": "scrypt", "kdfparams": { "dklen": 32, "n": 262144, "p": 1, "r": 8, "salt": "66244af389dff31b9324b20b50b7904e9d12174d902197c4f21c58474df6fa43" }, "mac": "d8c11f33435f858284ef211c9e36ce3782251f77a6cdc561547d77f6588563cd" }, "id": "b22e905c-1168-4e6d-833b-133bd6f0ada4", "version": 3 }
const decryptAccount = web3.eth.accounts.decrypt(keystore, 'eth');
console.log(decryptAccount.privateKey);

// 0x5ac6315a6c7750f0f039e6388a1cba7bca0df306223d54951eef2d60f1a6e507


var fromAddress = "0x4877b511b8e9e19606235bbe2c76d07be48800be";
var toAddress = "0x291b1a206615e5080d9bf4d66a1ea482c0fdcb66";
var amount = web3.utils.toHex(111111111);



// async function getTransactionByAccount(myaccount, startBlockNumber, endBlockNumber) {
//   console.log('Transaction By Account');
//   console.log('Account : ', myaccount);
  
//   if(startBlockNumber == null ) {
//     startBlockNumber = 0;
//   }
//   if(endBlockNumber == null) {
//     endBlockNumber = await web3.eth.getBlockNumber();
//   }
   
//   console.log('Block : ', startBlockNumber, ' - ', endBlockNumber);

//   let txs = [];

//   for (let i = startBlockNumber; i <= endBlockNumber; i++) {
//       let block = await web3.eth.getBlock(i);

//       if (block != null && block.transactions != null) {
//         for(let i=0; i<block.transactions.length; i++) {
//           var tx = await web3.eth.getTransaction(el);
//           if(myaccount.toUpperCase() == el.from.toUpperCase() || myaccount.toUpperCase() == el.to.toUpperCase()) {
//             txs.push(tx);
//           }

//         }
//       }
//   }
// }

async function sendTransaction(fromAddress, toAddress, amount) {
  var txPrams = {
    from: fromAddress,
    to: toAddress,
    value: amount,
    gas: web3.utils.toHex(0x21000)
  }

  var signedTx = await decryptAccount.signTransaction(txPrams);
  console.log(signedTx);

  web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .once('transactionHash', (hash) => {
      console.log(hash);
    })
}

/* url : /eth */
router.get('/', async function (req, res, next) {
  var blockNumber = await web3.eth.getBlockNumber();
  var showCount = 10;
  var blockList = [];

  var startNum = 0;
  var endNum = blockNumber;

  if (blockNumber > showCount) {
    startNum = blockNumber - showCount;
  }

  for (let i = startNum; i < endNum; i++) {
    let block = await web3.eth.getBlock(i);
    blockList.push(block);
  }

  //console.log('blockNumber : ', blockNumber);
  //console.log('blocks : ', JSON.stringify(blockList, null, 2));

  res.render('blockchain', { blocks: blockList, title: "blockchain", selectedIdx: startNum, txs: [] });
});

function getBalance() {
  web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
    .then(balance => {
      console.log(balance);
    });
}

router.get('/accountlist', function (req, res, next) {
  web3.eth.getAccounts()
    .then(async (accounts) => {
      console.log(accounts);
      let accountList = [];

      for (let i = 0; i < accounts.length; i++) {
        let balance = await web3.eth.getBalance(accounts[i]);
        accountList.push({
          WalletAddress: accounts[i],
          balance: web3.utils.fromWei(balance, "ether")
        })
      };
      res.render('accountlist', { accounts: accountList })
    });
});

router.get('/createaccount', function (req, res, next) {
  web3.eth.personal.newAccount("eth")
    .then(() => {
      res.redirect('/eth/accountlist');
    })
    .catch((err) => {
      console.log('ERR : create account error');
      res.redirect('/eth/accountlist');
    })
});

router.get('/block/:idx', function (req, res, next) {
  const selectedIdx = req.params.idx;

  res.render('blockchain',
    {
      title: "Blockchain info"
      , blocks: mychain.chain
      , selectedIdx: selectedIdx
      , txs: mychain.chain[selectedIdx].transactions
    }
  )
});

// router.get('/createtx', function (req, res, next) {
//   res.render('createtx', { wallet: '0x4877b511B8e9E19606235bbe2c76D07be48800Be' });
// })

// router.get('/createtx', async function (req, res, next) {
//   var accounts = await web3.eth.getAccounts();

//   res.render('createtx', { wallet: accounts[0] });
// })


// router.post('/createtx', function (req, res, next) {
//   const fromAddress = req.body.fromAddress;
//   const toAddress = req.body.toAddress;
//   const amount = web3.utils.toHex(req.body.amount);

//   console.log(fromAddress);
//   console.log(toAddress);
//   console.log(amount);

//   sendTransaction(fromAddress, toAddress, amount)
//     .then(() => {
//       res.redirect('/eth')
//     })
// })
router.get('/createtx', function (req, res, next) {
  web3.eth.getCoinbase().then((wallet) => {
       res.render('createtx', { wallet: wallet });
  })
})

router.post('/createtx', function (req, res, next) {
  const fromAddress = req.body.fromAddress;
  const toAddress = req.body.toAddress;
  const amount = req.body.amount;
  const keystore = {"address":"4877b511b8e9e19606235bbe2c76d07be48800be","crypto":{"cipher":"aes-128-ctr","ciphertext":"9ea786797e2b9456124cc67cb8e19a6cbac74831665ffef15adbb356c533043a","cipherparams":{"iv":"d36066b66f1f20b642f65bd1bc8377c3"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"66244af389dff31b9324b20b50b7904e9d12174d902197c4f21c58474df6fa43"},"mac":"d8c11f33435f858284ef211c9e36ce3782251f77a6cdc561547d77f6588563cd"},"id":"b22e905c-1168-4e6d-833b-133bd6f0ada4","version":3}
  const decryptAccount = web3.eth.accounts.decrypt(keystore, 'eth');

  console.log('fromAddress : ', fromAddress);
  console.log('toAddress : ', toAddress);
  console.log('amount : ', amount);

  async function sendTransaction(fromAddress, toAddress, amount) {
       var txPrams = {
            from: fromAddress,
            to: toAddress,
            value: amount,
            gas: web3.utils.toHex(0x21000)
       }

       var signedTx = await decryptAccount.signTransaction(txPrams);
       console.log(signedTx);


       web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .once('transactionHash', (hash) => {
        console.log(hash);
    })
  }
  sendTransaction(fromAddress, toAddress, amount);
  res.redirect('/eth');
})



router.get('/pendingtransaction', function (req, res, next) {
  res.render('pendingtransaction');
})


router.get('/miningblock', function (req, res, next) {
  mychain.minePendingTransactions(wallet1);
  console.log('blocked mined...');
  res.redirect('/eth');
})

router.get('/setting', function (req, res, next) {
  res.render('setting', {});
})

router.post('/setting', function (req, res, next) {
  const difficulty = req.body.difficulty;
  const reward = req.body.reward;

  console.log('difficult : ', difficulty);
  console.log('reward : ', reward);

  mychain.difficulty = parseInt(difficulty);
  mychain.miningReward = parseInt(reward);

  console.log(mychain);

  res.redirect('/eth/setting');
})

// 상세정보 보기
// router.get('/wallet/:address', async function (req, res, next) {
//   const address = req.params.address;
//   const getBalance = await web3.eth.getBalance(address);
//   const txs = await getTransactionByAccount(address);

//   res.render('wallet',
//     {
//       title: "Wallet info"
//       , address: address
//       , balance: getBalance
//       , txs:txs
//     })
// });

router.get('/wallet/:address', function (req, res, next) {
  const address = req.params.address;
  let transactionlist = [];

  web3.eth.getBlockNumber().then(async (BlockNumber) => {

       for (let i = 0; i <= BlockNumber; i++) {

         await web3.eth.getBlock(i).then((block) => {
                 block.transactions.forEach((el) => {
                      web3.eth.getTransaction(el).then((tx) => {
                           if(address == tx.from || address == tx.to) {
                                transactionlist.push({
                                     fromAddress: tx.from,
                                     toAddress: tx.to,
                                     blockNumber: tx.blockNumber,
                                     amount: tx.value,
                                });
                           }
                      }).catch((err) => {
                           console.log("getTransaction err : ", err);
                      });
                      console.log("transactionlist : ", transactionlist);
                 });
            }).catch((err) => {
                 console.log("getTransaction err : ", err);
            });
       };
       let balance = await web3.eth.getBalance(address);
       console.log("balance : ", balance);
       res.render('wallet', {
            address: address,
            txs: transactionlist,
            balance: balance
       });
  });
});

router.get('/createaccount', function (req, res, next) {
  const newKey = ec.genKeyPair();
  const newAccount = {
    "PrivKey": newKey.getPrivate('hex'),
    "PublicKey": newKey.getPublic('hex'),
    "WalletAddress": newKey.getPublic('hex')
  }

  mychain.accounts.push(newAccount);
  mychain.saveKeyStore();

  res.redirect('/eth/accountlist');

})

module.exports = router;
