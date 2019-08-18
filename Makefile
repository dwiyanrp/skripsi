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

delete:
	@rm -rf ./blockchain

run:
	@geth --datadir ./blockchain/main --networkid 15 --rpc --rpccorsdomain "*" --rpcport 8545 --port 30303

run-2:
	@geth --datadir ./blockchain/2 --networkid 15 --rpc --rpccorsdomain "*" --rpcport 8546 --port 30304

run-3:
	@geth --datadir ./blockchain/3 --networkid 15 --rpc --rpccorsdomain "*" --rpcport 8547 --port 30305

attach:
	@geth attach ./blockchain/main/geth.ipc

attach-2:
	@geth attach ./blockchain/2/geth.ipc

attach-3:
	@geth attach ./blockchain/3/geth.ipc

accounts:
	@geth --datadir ./blockchain/main account list

accounts-2:
	@geth --datadir ./blockchain/2 account list

accounts-3:
	@geth --datadir ./blockchain/3 account list

static-nodes:
	@tee blockchain/main/static-nodes.json blockchain/2/static-nodes.json blockchain/3/static-nodes.json < static-nodes.json