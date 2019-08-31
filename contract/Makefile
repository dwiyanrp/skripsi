init:
	@geth --datadir blockchain/main account new --password password.txt
	@geth --datadir blockchain/main init genesis.json
	@echo " >> Block main created"
	@geth --datadir blockchain/2 account new --password password.txt
	@geth --datadir blockchain/2 init genesis.json
	@echo " >> Block 2 created"
	@geth --datadir blockchain/3 account new --password password.txt
	@geth --datadir blockchain/3 init genesis.json
	@echo " >> Block 3 created"
	@geth --datadir blockchain/4 account new --password password.txt
	@geth --datadir blockchain/4 init genesis.json
	@echo " >> Block 4 created"
	@geth --datadir blockchain/5 account new --password password.txt
	@geth --datadir blockchain/5 init genesis.json
	@echo " >> Block 5 created"
	@geth --datadir blockchain/6 account new --password password.txt
	@geth --datadir blockchain/6 init genesis.json
	@echo " >> Block 6 created"

delete:
	@rm -rf ./blockchain

run:
	@geth --datadir ./blockchain/main --networkid 100 --rpc --rpccorsdomain "*" --rpcport 8545 --port 30303 --rpcaddr "0.0.0.0" --rpcapi admin,debug,eth,ethash,miner,net,personal,rpc,txpool,web3 --allow-insecure-unlock --unlock 0 --mine --minerthreads 1

run-2:
	@geth --datadir ./blockchain/2 --networkid 100 --rpc --rpccorsdomain "*" --rpcport 8546 --port 30304 --mine --minerthreads 1

run-3:
	@geth --datadir ./blockchain/3 --networkid 100 --rpc --rpccorsdomain "*" --rpcport 8547 --port 30305 --mine --minerthreads 1

run-4:
	@geth --datadir ./blockchain/4 --networkid 100 --rpc --rpccorsdomain "*" --rpcport 8548 --port 30306 --mine --minerthreads 1

run-5:
	@geth --datadir ./blockchain/5 --networkid 100 --rpc --rpccorsdomain "*" --rpcport 8549 --port 30307 --mine --minerthreads 1

run-6:
	@geth --datadir ./blockchain/6 --networkid 100 --rpc --rpccorsdomain "*" --rpcport 8550 --port 30308 --mine --minerthreads 1

a:
	@geth attach ./blockchain/main/geth.ipc

a2:
	@geth attach ./blockchain/2/geth.ipc

a3:
	@geth attach ./blockchain/3/geth.ipc

a4:
	@geth attach ./blockchain/4/geth.ipc

a5:
	@geth attach ./blockchain/5/geth.ipc

a6:
	@geth attach ./blockchain/6/geth.ipc

accounts:
	@geth --datadir ./blockchain/main account list

accounts-2:
	@geth --datadir ./blockchain/2 account list

accounts-3:
	@geth --datadir ./blockchain/3 account list

accounts-4:
	@geth --datadir ./blockchain/4 account list

accounts-5:
	@geth --datadir ./blockchain/5 account list

accounts-6:
	@geth --datadir ./blockchain/6 account list

static-nodes:
	@tee blockchain/main/static-nodes.json blockchain/2/static-nodes.json blockchain/3/static-nodes.json blockchain/4/static-nodes.json blockchain/5/static-nodes.json blockchain/6/static-nodes.json < static-nodes.json
