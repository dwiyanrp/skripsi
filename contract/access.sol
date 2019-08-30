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
        address[] listAccess;
        mapping(address => AccessRule) access;
    }

    struct AccessRule {
        address manager;
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

    function editManager(bytes32 _name) public {
        Manager storage manager = managers[msg.sender];
        manager.name = _name;
        emit ManagerEvent(manager.name);
    }

    function getManager() public view returns (address, bytes32, bytes17[] memory) {
        Manager storage manager = managers[msg.sender];
        return (msg.sender, manager.name, manager.devices);
    }

    function addDevice(bytes17 _deviceID, uint8 _deviceType) public {
        if (devices[_deviceID].isExists) {
            return;
        }
    
        devices[_deviceID].deviceID = _deviceID;
        devices[_deviceID].deviceType = _deviceType;
        devices[_deviceID].owner = msg.sender;
        devices[_deviceID].isExists = true;

        managers[msg.sender].devices.push(_deviceID);
        emit DeviceEvent(1, _deviceID);
    }

    function deleteDevice(bytes17 _deviceID) public onlyOwner(_deviceID) {
        if (!devices[_deviceID].isExists) {
            return;
        }

        delete(devices[_deviceID]);
        uint arrLength = managers[msg.sender].devices.length;
        for (uint i = 0; i < arrLength; i++){
            if (managers[msg.sender].devices[i] == _deviceID) {
                managers[msg.sender].devices[i] = managers[msg.sender].devices[arrLength-1];
            }
        }
        managers[msg.sender].devices.length--;
    }
    
    function getDevice(bytes17 _deviceID) public view returns (bytes17, uint8, address, bool) {
        return (devices[_deviceID].deviceID, devices[_deviceID].deviceType, devices[_deviceID].owner, devices[_deviceID].isExists);
    }

    function addRule(bytes17 _deviceID, address _managerAddr) public onlyOwner(_deviceID) {
        devices[_deviceID].access[_managerAddr] = AccessRule(_managerAddr);
        devices[_deviceID].listAccess.push(_managerAddr);
    }

    function deleteRule(bytes17 _deviceID, address _managerAddr) public onlyOwner(_deviceID) {
        delete(devices[_deviceID].access[_managerAddr]);
        uint arrLength = devices[_deviceID].listAccess.length;
        for (uint i = 0; i < arrLength; i++){
            if (devices[_deviceID].listAccess[i] == _managerAddr) {
                devices[_deviceID].listAccess[i] = devices[_deviceID].listAccess[arrLength-1];
            }
        }
        devices[_deviceID].listAccess.length--;
    }
    
    function getRules(bytes17 _deviceID) public view returns (address[] memory) {
        return devices[_deviceID].listAccess;
    }

    function checkAccess(bytes17 _deviceID) public view returns (bool) {
        if (devices[_deviceID].owner == msg.sender) return true;
        return devices[_deviceID].access[msg.sender].manager == msg.sender;
    }
}