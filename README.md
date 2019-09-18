# How to run blockchain on Server :
1. Create server ( OS Ubuntu 18.04.3 LTS, Minimum 2GB RAM ) if less than 2GB RAM, miner sometimes not run
2. Run command update, upgrade & install build-essential
```
sudo apt update
sudo apt upgrade
sudo apt install build-essential
```
3. Install [geth](https://geth.ethereum.org/downloads/) ( Version 1.9.2 )
```
wget https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.9.2-e76047e9.tar.gz
tar xvf geth-linux-amd64-1.9.2-e76047e9.tar.gz
sudo mv geth-linux-amd64-1.9.2-e76047e9/geth /usr/local/bin
rm -r geth-linux-amd64-1.9.2-e76047e9*
```
4. Clone this git
```
git clone https://github.com/dwiyanrp/skripsi.git
cd skripsi
```
5. Init & run blockchain with geth
```
cd contract
make init ( will create 6 blockchain )
make run ( will run main blockchain, rpc port 8545 & port 30303 ( default ))
```
6. Open [Remix - Ethereum IDE](http://remix.ethereum.org/#optimize=false&evmVersion=null&version=soljson-v0.5.11+commit.c082d0b4.js) for edit, compile & deploy contract (make use http, not https)
    - Go to Plugin Manager and install **Solidity Compiler** & **Deploy & Run Transactions**
    - Enable auto compile on **Solidity Compiler** ( for ease deploy contract )
    - Create new file access.sol
    - Open access.sol on this git ( skripsi/contract/access.sol )
    - Change environment to **Web 3 Provider**, set url to server url.
    - Compile & Deploy contract.
7. Open file 