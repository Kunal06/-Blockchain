// Define a block
const SHA256= require('crypto-js/sha256');
class Block{
  constructor(index, timestamp, data, previousHash = ''){
    this.index= index;
    this.timestamp= timestamp;
    this.data= data;
    this.previoushash = previousHash;
    this.hash = this.calculateHash();
  }
  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class Blockchain{
  constructor(){
    this.chain= [this.createGenesisBlock()];
  }
  // First Block of chain is always Genesis Block
  createGenesisBlock(){
    return new Block(0,"01/01/2018", "Genesis block", "0");
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock){
    newBlock.previousHash= this.getLatestBlock().hash;
    newBlock.hash= newBlock.calculateHash();
    this.chain.push(newBlock);
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
Coin.addBlock(new Block(1, "10/03/2018", {amount:4}));
Coin.addBlock(new Block(2, "10/06/2018", {amount:10}));

console.log("Is Chain Valid - "+ Coin.isChainValid());
//console.log(JSON.stringify(Coin, null, 4));
