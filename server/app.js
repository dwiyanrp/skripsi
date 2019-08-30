const Web3 =  require('web3')
const fastify = require('fastify')()
// const fastify = require('fastify')({ logger: { level: 'info'} })

const config = {
    url: "http://139.59.104.37:8545",
    abi: [ { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_deviceType", "type": "uint8" } ], "name": "addDevice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_managerAddr", "type": "address" }, { "name": "_startTime", "type": "uint32" }, { "name": "_endTime", "type": "uint32" } ], "name": "addRule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "deleteDevice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_managerAddr", "type": "address" } ], "name": "deleteRule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_name", "type": "bytes32" } ], "name": "setManager", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "name", "type": "bytes32" } ], "name": "ManagerEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "typeEvent", "type": "int8" }, { "indexed": false, "name": "deviceID", "type": "bytes17" } ], "name": "DeviceEvent", "type": "event" }, { "constant": true, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "getDevice", "outputs": [ { "name": "", "type": "bytes17" }, { "name": "", "type": "uint8" }, { "name": "", "type": "address" }, { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getManager", "outputs": [ { "name": "", "type": "address" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "bytes17[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "getRule", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" } ],
    address: "0xdf6a93bb1e88c5e792ace980e9c501f86a8c4da0"
}

const web3 = new Web3(config.url);
const contract = new web3.eth.Contract(config.abi, config.address);
var accounts;

fastify.get('/mymanager', async (request, reply) => {
    let response,responseError;
    await contract.methods.getManager().call().then((result) => {
        response = {
            manager : {
                address: result["0"],
                name: web3.utils.hexToUtf8(result["1"]),
                devices: []
            }
        }

        for (let i = 0; i < result["2"].length; i++) {
            response.manager.devices.push(web3.utils.hexToUtf8(result["2"][i]))
        }
    })

    return {data : response}
})

fastify.post('/manager', async (request, reply) => {
    let userAddress = accounts[request.headers.authorization];
    let name = request.body.name;
    let hexName = web3.utils.utf8ToHex(name);

    let response,responseError;
    await contract.methods.setManager(hexName).send({from: userAddress, gas: 3000000}).then((result) => {response = result})

    return {data: response}
})

// Manager can add new device
fastify.post('/device', async (request, reply) => {
    let userAddress = accounts[request.headers.authorization];
    let macAddress = web3.utils.utf8ToHex(request.body.device_id);
    let deviceType = request.body.device_type;

    let response,responseError;
    await contract.methods.addDevice(macAddress, deviceType).send({from: userAddress, gas: 3000000}).then((result) => {response = result})

    return {result: response}
})

// Manager can remove device
fastify.delete('/device/:device_id', async (request, reply) => {
    let userAddress = accounts[request.headers.authorization];
    let deviceID = request.body.device_id;
    return {user_address: userAddress}
})

// Everyone can get device data
fastify.get('/device', async (request, reply) => {
    let macAddress = web3.utils.utf8ToHex(request.query.device_id);

    let response,responseError;
    await contract.methods.getDevice(macAddress).call().then((result) => {
        if (!result["3"]) { // check is device exists
            responseError = "Device not exists"
        } else {
            response = {
                device: {
                    device_id: web3.utils.hexToUtf8(result["0"]),
                    device_type: result["1"],
                    owner_address: result["2"]
                }
            }
        }
    })

    return {data: response, error: responseError}
})

// Manager can add rule to device
fastify.post('/device/:device_id', async (request, reply) => {
    let response,responseError;

    let userAddress = accounts[request.headers.authorization];
    let deviceID = request.body.device_id;
    return { user_address: userAddress }
})

// Manager can remove rule
fastify.delete('/device/:device_id/rule/:user_id', async (request, reply) => {
    let response,responseError;

    let userAddress = accounts[request.headers.authorization];
    let deviceID = request.body.device_id;
    return { user_address: userAddress }
})

// Manager can get devices rules
fastify.get('/device/:device_id/rules', async (request, reply) => {
    let response,responseError;

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
    setInterval(async function(){ accounts = await web3.eth.getAccounts() }, 5000);

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
