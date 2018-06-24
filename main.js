// Define a block
const SHA256= require('crypto-js/sha256');
class Block{
  constructor(index, timestamp, data, previousHash = ''){
    this.index= index;
    this.timestamp= timestamp;
    this.data= data;
    this.previoushash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 1;
  }
  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce ).toString();
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
    this.difficulty= 4;
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
    // newBlock.hash= newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
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

console.log("Mining Block 1 ....");
Coin.addBlock(new Block(1, "10/03/2018", {amount:4}));

console.log("Mining Block 2 ....");
Coin.addBlock(new Block(2, "10/06/2018", {amount:10}));

/* VERIFICATION
console.log("Is Chain Valid - "+ Coin.isChainValid());

Coin.chain[1].data= { amount:100 };
Coin.chain[1].hash= Coin.chain[1].calculateHash();

console.log("Is Chain Valid - "+ Coin.isChainValid());

//console.log(JSON.stringify(Coin, null, 4));
*/
