const Web3 =  require('web3')
const fastify = require('fastify')()

const config = {
    url: "http://139.59.104.37:8545",
    abi:  [ { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "deleteDevice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_managerAddr", "type": "address" } ], "name": "deleteRule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "getDevice", "outputs": [ { "name": "", "type": "bytes17" }, { "name": "", "type": "uint8" }, { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_managerAddr", "type": "address" }, { "name": "_startTime", "type": "uint32" }, { "name": "_endTime", "type": "uint32" } ], "name": "addRule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_deviceID", "type": "bytes17" } ], "name": "getRule", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getManager", "outputs": [ { "name": "", "type": "address" }, { "name": "", "type": "bytes20" }, { "name": "", "type": "bytes17[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_name", "type": "bytes20" } ], "name": "setManager", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_deviceID", "type": "bytes17" }, { "name": "_deviceType", "type": "uint8" } ], "name": "addDevice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "name", "type": "bytes20" } ], "name": "ManagerEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "typeEvent", "type": "int8" }, { "indexed": false, "name": "deviceID", "type": "bytes20" } ], "name": "DeviceEvent", "type": "event" } ],
    address: "0x7ce63106ddedbd5e430e602052ac02e02c76c3b7"
}

const web3 = new Web3(config.url);
const contract = new web3.eth.Contract(config.abi, config.address);
var managerAddress,result;

// Manager can add new device
fastify.post('/device', async (request, reply) => {
    var user = request.query['user'];
    var deviceID = request.query['device_id'];
    return { hello: 'world' }
})

// Manager can remove device
fastify.delete('/device/:device_id', async (request, reply) => {
    var user = request.query['user'];
    var deviceID = request.query['device_id'];
    return { hello: 'world' }
})

// Manager can add rule to device
fastify.post('/device/:device_id', async (request, reply) => {
    var user = request.query['user'];
    var deviceID = request.query['device_id'];
    return { hello: 'world' }
})

// Manager can get devices rules
fastify.get('/device/:device_id/rules', async (request, reply) => {
    var user = request.query['user'];
    var deviceID = request.query['device_id'];
    return { hello: 'world' }
})

// Manager can remove rule
fastify.delete('/device/:device_id/rule/:user_id', async (request, reply) => {
    var user = request.query['user'];
    var deviceID = request.query['device_id'];
    return { hello: 'world' }
})

// User can check got authorized to access rule or not
fastify.get('/device/:device_id/rule/:user_id', async (request, reply) => {
    var user = request.query['user'];
    var deviceID = request.query['device_id'];
    return { hello: 'world' }
})

// Run the server!
const start = async () => {
    result = await web3.eth.getAccounts();
    managerAddress = result[0];

    try {
        await fastify.listen(8080)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()


// main();

// async function main() {
//     result = await web3.eth.getAccounts();
//     address = result[0];
//     const startTime = new Date();

//     let data = [], start = 11, totalData = 5;
//     for(let i = start; i < start+totalData; i++) {
//         data.push('0x00000000000000000000000000000000' + i);
//     }

//     console.log(data)

//     console.info('Execution time: %dms', (new Date() - startTime))
// }