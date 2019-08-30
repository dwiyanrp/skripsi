const Web3 =  require('web3')
const fastify = require('fastify')()
const utf8 = require('utf8');
// const fastify = require('fastify')({ logger: { level: 'info'} })

const config = {
    url: "http://139.59.104.37:8545",
    abi:  [ { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "deleteDevice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_managerAddr", "type": "address" } ], "name": "deleteRule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "getDevice", "outputs": [ { "name": "", "type": "bytes17" }, { "name": "", "type": "uint8" }, { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_managerAddr", "type": "address" }, { "name": "_startTime", "type": "uint32" }, { "name": "_endTime", "type": "uint32" } ], "name": "addRule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "getRule", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getManager", "outputs": [ { "name": "", "type": "address" }, { "name": "", "type": "bytes20" }, { "name": "", "type": "bytes17[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_name", "type": "bytes20" } ], "name": "setManager", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_deviceType", "type": "uint8" } ], "name": "addDevice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "name", "type": "bytes20" } ], "name": "ManagerEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "typeEvent", "type": "int8" }, { "indexed": false, "name": "deviceID", "type": "bytes20" } ], "name": "DeviceEvent", "type": "event" } ],
    address: "0x9f02b5b5ee1e321ac6aebb55d9bb7f9b8bf5af22"
}

const web3 = new Web3(config.url);
const contract = new web3.eth.Contract(config.abi, config.address);
var accounts;

// Manager can add new device
fastify.post('/device', async (request, reply) => {
    let userAddress = accounts[request.headers.authorization];
    let deviceID = request.body.device_id;
    let macAddress = web3.utils.utf8ToHex(deviceID);
    return { user_address: userAddress, macAddress: macAddress}
})

// Manager can remove device
fastify.delete('/device/:device_id', async (request, reply) => {
    let userAddress = accounts[request.headers.authorization];
    let deviceID = request.body.device_id;
    return { user_address: userAddress }
})

// Manager can add rule to device
fastify.post('/device/:device_id', async (request, reply) => {
    let userAddress = accounts[request.headers.authorization];
    let deviceID = request.body.device_id;
    return { user_address: userAddress }
})

// Manager can remove rule
fastify.delete('/device/:device_id/rule/:user_id', async (request, reply) => {
    let userAddress = accounts[request.headers.authorization];
    let deviceID = request.body.device_id;
    return { user_address: userAddress }
})

// Manager can get devices rules
fastify.get('/device/:device_id/rules', async (request, reply) => {
    let userAddress = accounts[request.headers.authorization];
    let deviceID = request.body.device_id;
    return { user_address: userAddress }
})

// User can check got authorized to access rule or not
fastify.get('/device/:device_id/rule/:user_id', async (request, reply) => {
    let userAddress = accounts[request.headers.authorization];
    let deviceID = request.body.device_id;
    return { user_address: userAddress }
})

// User can check got authorized to access rule or not
fastify.post('/sync/accounts', async (request, reply) => {
    accounts = await web3.eth.getAccounts();
    return { accounts: accounts }
})

// Run the server!
const start = async () => {
    accounts = await web3.eth.getAccounts();
    try {
        console.log("server run on 127.0.0.1:8080")
        await fastify.listen(8080)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
