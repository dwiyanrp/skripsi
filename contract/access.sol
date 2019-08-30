pragma solidity ^0.5.1;

contract AccessContract {

    struct Manager {
        bytes32 name;
        bytes17[] devices;
    }

    struct Device {
        bytes17 deviceID; // MAC Address
        uint8 deviceType;
        address owner;
        bool isExists;
        mapping(address => AccessRule) access;
    }

    struct AccessRule {
        address manager;
        uint32 startTime;
        uint32 endTime;
    }

    mapping(address => Manager) managers;
    mapping(bytes17 => Device) devices;

    modifier onlyOwner(bytes17 _deviceID) {
        require(
            devices[_deviceID].owner == msg.sender,
            "Sender not authorized."
        );
        _;
    }

    event ManagerEvent(
        bytes32 name
    );

    event DeviceEvent(
        int8 typeEvent,
        bytes17 deviceID
    );

    function setManager(bytes32 _name) public {
        Manager storage manager = managers[msg.sender];
        manager.name = _name;
        emit ManagerEvent(manager.name);
    }

    function getManager() public view returns (address, bytes32, bytes17[] memory) {
        Manager storage manager = managers[msg.sender];
        return (msg.sender, manager.name, manager.devices);
    }

    function addDevice(bytes17 _deviceID, uint8 _deviceType) public {
        devices[_deviceID].deviceID = _deviceID;
        devices[_deviceID].deviceType = _deviceType;
        devices[_deviceID].owner = msg.sender;
        devices[_deviceID].isExists = true;

        managers[msg.sender].devices.push(_deviceID);
        emit DeviceEvent(1, _deviceID);
    }
    
    // Return DeviceID, DeviceType & Owner
    function getDevice(bytes17 _deviceID) public view returns (bytes17, uint8, address, bool) {
        return (devices[_deviceID].deviceID, devices[_deviceID].deviceType, devices[_deviceID].owner, devices[_deviceID].isExists);
    }

    function deleteDevice(bytes17 _deviceID) public {
        require(
            devices[_deviceID].owner == msg.sender,
            "Sender not authorized."
        );
        delete(devices[_deviceID]);
    }

    function addRule(bytes17 _deviceID, address _managerAddr, uint32 _startTime, uint32 _endTime) public onlyOwner(_deviceID) {
        devices[_deviceID].access[_managerAddr] = AccessRule(_managerAddr, _startTime, _endTime);
    }

    function getRule(bytes17 _deviceID) public view returns (bool) {
        if (devices[_deviceID].owner == msg.sender) return true;
        return devices[_deviceID].access[msg.sender].manager == msg.sender;
    }

    function deleteRule(bytes17 _deviceID, address _managerAddr) public onlyOwner(_deviceID) {
        delete(devices[_deviceID].access[_managerAddr]);
    }
}