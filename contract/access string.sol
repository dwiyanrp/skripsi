pragma solidity ^0.5.1;

contract AccessContract {

    struct Manager {
        string name;
        bytes20[] devices;
    }

    struct Device {
        bytes20 deviceID; // MAC Address
        uint8 deviceType;
        address owner;
        mapping(address => AccessRule) access;
    }

    struct AccessRule {
        address manager;
    }

    mapping(address => Manager) managers;
    mapping(bytes20 => Device) devices;

    modifier onlyOwner(bytes20 _deviceID) {
        require(
            devices[_deviceID].owner == msg.sender,
            "Sender not authorized."
        );
        _;
    }

    event ManagerEvent(
        string name
    );

    event DeviceEvent(
        int8 typeEvent,
        bytes20 deviceID
    );

    function setManager(string memory _name) public {
        Manager storage manager = managers[msg.sender];
        manager.name = _name;
        emit ManagerEvent(manager.name);
    }

    function getManager() public view returns (address, string memory, bytes20[] memory) {
        Manager storage manager = managers[msg.sender];
        return (msg.sender, manager.name, manager.devices);
    }

    function addDevice(bytes17 _deviceID, uint8 _deviceType) public {
        devices[_deviceID].deviceID = _deviceID;
        devices[_deviceID].deviceType = _deviceType;
        devices[_deviceID].owner = msg.sender;

        managers[msg.sender].devices.push(_deviceID);
        emit DeviceEvent(1, _deviceID);
    }
    
    // Return DeviceID, DeviceType & Owner
    function getDevice(bytes20 _deviceID) public view returns (bytes20, uint8, address) {
        return (devices[_deviceID].deviceID, devices[_deviceID].deviceType, devices[_deviceID].owner);
    }

    function deleteDevice(bytes20 _deviceID) public {
        require(
            devices[_deviceID].owner == msg.sender,
            "Sender not authorized."
        );
        delete(devices[_deviceID]);
    }

    function addRule(bytes20 _deviceID, address _managerAddr) public onlyOwner(_deviceID) {
        devices[_deviceID].access[_managerAddr] = AccessRule(_managerAddr);
    }

    function getRule(bytes20 _deviceID) public view returns (bool) {
        if (devices[_deviceID].owner == msg.sender) return true;
        return devices[_deviceID].access[msg.sender].manager == msg.sender;
    }

    function deleteRule(bytes20 _deviceID, address _managerAddr) public onlyOwner(_deviceID) {
        delete(devices[_deviceID].access[_managerAddr]);
    }
}