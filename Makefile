init:
	@geth --datadir blockchain/1 account new --password password.txt
	@geth --datadir blockchain/1 init genesis.json
	@echo " >> Block 1 created"
	@geth --datadir blockchain/2 account new --password password.txt
	@geth --datadir blockchain/2 init genesis.json
	@echo " >> Block 2 created"
	@geth --datadir blockchain/3 account new --password password.txt
	@geth --datadir blockchain/3 init genesis.json
	@echo " >> Block 3 created"

delete:
	@rm -rf ./blockchain

run-1:
	@geth --datadir ./blockchain/1 --networkid 15 --rpc --rpccorsdomain "*" --rpcport 10001 --port 30001

run-2:
	@geth --datadir ./blockchain/2 --networkid 15 --rpc --rpccorsdomain "*" --rpcport 10002 --port 30002

run-3:
	@geth --datadir ./blockchain/3 --networkid 15 --rpc --rpccorsdomain "*" --rpcport 10003 --port 30003

attach-1:
	@geth attach ./blockchain/1/geth.ipc

attach-2:
	@geth attach ./blockchain/2/geth.ipc

accounts:
	@geth --datadir ./blockchain/1 account list

static-nodes:
	@tee blockchain/1/static-nodes.json blockchain/2/static-nodes.json blockchain/3/static-nodes.json < static-nodes.json