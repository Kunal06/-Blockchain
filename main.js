// Define a block
const SHA256= require('crypto-js/sha256');
class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress= fromAddress;
    this.toAddress= toAddress;
    this.amount= amount;
  }
}
class Block{
  constructor(timestamp, transactions, previousHash = ''){
    this.timestamp= timestamp;
    this.transactions= transactions;
    this.previoushash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 1;
  }
  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce ).toString();
  }
  mineBlock(difficulty){
    while (this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined - "+ this.hash);
  }

}



class Blockchain{
  constructor(){
    this.chain= [this.createGenesisBlock()];
    this.difficulty= 2;
    this.pendingTransactions= [];
    this.miningReward = 100;
  }
  // First Block of chain is always Genesis Block
  createGenesisBlock(){
    return new Block("01/01/2018", "Genesis block", "0");
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }
  /*
  addBlock(newBlock){
    newBlock.previousHash= this.getLatestBlock().hash;
    // newBlock.hash= newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  */
  minePendingTransactions(miningRewardAddress){
    let block= new Block(Date.now(), this.pendingTransactions);
    // Assuming miner will take all pending transactions whereas in reality they pick the transactions
    block.mineBlock(this.difficulty);
    console.log('Block Successfully mined!');
    this.chain.push(block);

    this.pendingTransactions= [ new Transaction(null, miningRewardAddress, this.miningReward) ];
  }
  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }
  getBalanceOfAddress(address){
    let balance = 0;
    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }
        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid(){
    let currentBlock;
    let previousBlock;
    for(let i = 1; i< this.chain.length; i++){
      currentBlock = this.chain[i];
      previousBlock = this.chain[i-1];
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }
      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
    }
    return true;
  }
}

let Coin= new Blockchain();
Coin.createTransaction(new Transaction('address 1','address 2', 100));
Coin.createTransaction(new Transaction('address 2','address 1', 50));

console.log('\n Starting the miner....');
Coin.minePendingTransactions('miners-address');

console.log('\n Balance of Miner is ', Coin.getBalanceOfAddress('miners-address'));

console.log('\n Starting the miner again....');
Coin.minePendingTransactions('miners-address');

console.log('\n Balance of Miner is ', Coin.getBalanceOfAddress('miners-address'));



/*
console.log("Mining Block 1 ....");
Coin.addBlock(new Block(1, "10/03/2018", {amount:4}));

console.log("Mining Block 2 ....");
Coin.addBlock(new Block(2, "10/06/2018", {amount:10}));

 VERIFICATION
console.log("Is Chain Valid - "+ Coin.isChainValid());

Coin.chain[1].data= { amount:100 };
Coin.chain[1].hash= Coin.chain[1].calculateHash();

console.log("Is Chain Valid - "+ Coin.isChainValid());

//console.log(JSON.stringify(Coin, null, 4));
*/
