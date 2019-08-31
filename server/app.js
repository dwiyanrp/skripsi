const Web3 =  require('web3')
const fastify = require('fastify')()
// const fastify = require('fastify')({ logger: { level: 'info'} })

const config = {
    url: "http://139.59.104.37:8545",
    abi: [ { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_deviceType", "type": "uint8" } ], "name": "addDevice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_managerAddr", "type": "address" } ], "name": "addRule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "deleteDevice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_managerAddr", "type": "address" } ], "name": "deleteRule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_name", "type": "bytes32" } ], "name": "editManager", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "name", "type": "bytes32" } ], "name": "ManagerEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "typeEvent", "type": "int8" }, { "indexed": false, "name": "deviceID", "type": "bytes17" } ], "name": "DeviceEvent", "type": "event" }, { "constant": true, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "checkAccess", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "getDevice", "outputs": [ { "name": "", "type": "bytes17" }, { "name": "", "type": "uint8" }, { "name": "", "type": "address" }, { "name": "", "type": "bool" }, { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getManager", "outputs": [ { "name": "", "type": "address" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "bytes17[]" } ], "payable": false, "stateMutability": "view", "type": "function" } ],
    address: "0x4a8ac95539789e3df12b79fd87e55c46c7cee662"
}

const web3 = new Web3(config.url);
const contract = new web3.eth.Contract(config.abi, config.address);
var accounts;

fastify.put('/manager', async (request, reply) => {
    let userAddress = request.headers.authorization;
    if (userAddress == "") {
        reply.code(400).send({error: "Unauthorized Account"})
    }

    let name = request.body.name;
    let hexName = web3.utils.utf8ToHex(name);

    let response,responseError;
    await contract.methods.editManager(hexName).send({from: userAddress, gas: 3000000})
    .on('receipt', function(receipt) {
        response = receipt;
    })
    .on('error', function(err) {
        console.log(err)
    })

    return {data: response}
})

fastify.get('/mymanager', async (request, reply) => {
    let userAddress = request.headers.authorization;
    if (userAddress == "") {
        reply.code(400).send({error: "Unauthorized Account"})
    }

    let response,responseError;
    await contract.methods.getManager().call({from: userAddress}).then((result) => {
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

// Manager can add new device
fastify.post('/device', async (request, reply) => {
    let userAddress = request.headers.authorization;
    if (userAddress == "") {
        reply.code(400).send({error: "Unauthorized Account"})
    }

    let macAddress = web3.utils.utf8ToHex(request.body.device_id);
    let deviceType = request.body.device_type;

    let response,responseError;
    await contract.methods.addDevice(macAddress, deviceType).send({from: userAddress, gas: 3000000}).then((result) => {response = result})

    return {data: response}
})

// Manager can delete device
fastify.delete('/device', async (request, reply) => {
    let userAddress = request.headers.authorization;
    if (userAddress == "") {
        reply.code(400).send({error: "Unauthorized Account"})
    }

    let macAddress = web3.utils.utf8ToHex(request.query.device_id);
    await contract.methods.deleteDevice(macAddress).send({from: userAddress, gas: 3000000})
    .on('receipt', function(receipt) {
        response = receipt;
    })
    .on('error', function(err) {
        console.log(err)
    })

    return {data: userAddress}
})

// Everyone can get device info
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
                    owner_address: result["2"],
                    device_rules: result["4"]
                }
            }
        }
    })

    return {data: response, error: responseError}
})

// Manager can add rule to device
fastify.post('/rule', async (request, reply) => {
    let userAddress = request.headers.authorization;
    if (userAddress == "") {
        reply.code(400).send({error: "Unauthorized Account"})
    }

    let macAddress = web3.utils.utf8ToHex(request.body.device_id);
    let grantUser = request.body.user_address;

    let isDeviceExists = false;
    await contract.methods.getDevice(macAddress).call().then((result) => {isDeviceExists=result["3"]})
    if (!isDeviceExists) {
        return {error: "Device not exists"}
    }


    let response,responseError;
    await contract.methods.addRule(macAddress, grantUser).send({from: userAddress, gas: 3000000})
    .on('receipt', function(receipt) {
        response = receipt;
    })
    .on('error', function(err) {
        console.log(err)
    })

    return {data: response, error: responseError}
})

// Manager can delete rule
fastify.delete('/rule', async (request, reply) => {
    let userAddress = request.headers.authorization;
    if (userAddress == "") {
        reply.code(400).send({error: "Unauthorized Account"})
    }

    let macAddress = web3.utils.utf8ToHex(request.body.device_id);
    let grantUser = request.body.user_address;

    let isRuleExists = false;
    await contract.methods.checkAccess(macAddress).call({from: grantUser}).then((result) => {isRuleExists = result})
    if (!isRuleExists) {
        reply.code(400).send({error: "Rule not exists"})
    }

    let response,responseError;
    await contract.methods.deleteRule(macAddress, grantUser).send({from: userAddress, gas: 3000000}).then((result) => {response = result})

    return {data: response}
})

// User can check got authorized to access rule or not
fastify.get('/rule', async (request, reply) => {
    let userAddress = request.headers.authorization;
    if (userAddress == "") {
        reply.code(400).send({error: "Unauthorized Account"})
    }

    let macAddress = web3.utils.utf8ToHex(request.query.device_id);
    await contract.methods.checkAccess(macAddress).call({from: userAddress}).then((result) => {
        response = {
            access: result
        }
    })

    return {data: response}
})

// User can check got authorized to access rule or not
fastify.get('/accounts', async (request, reply) => {
    accounts = await web3.eth.getAccounts();
    response = {
        accounts
    }
    return {data: response}
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
