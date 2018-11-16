pragma solidity ^0.4.24;

contract Access {

    struct Manager {
        bytes20 name;
        bytes20[] devices;
    }
    
    struct Device {
        bytes20 deviceID; // MAC Address
        uint16 deviceType;
        address owner;
        mapping(address => AccessRule) access;
    }
    
    struct AccessRule {
        address manager;
        uint32 startTime;
        uint32 endTime;
    }
    
    mapping(address => Manager) managers;
    mapping(bytes20 => Device) devices;
    
    modifier onlyOwner(bytes20 _deviceID) {
        require(devices[_deviceID].owner == msg.sender);
        _;
    }
    
    event ManagerEvent(
        bytes20 name
    );
    
    event DeviceEvent(
        int8 typeEvent,
        bytes20 deviceID
    );
  
    function setManager(bytes20 _name) public {
        Manager storage manager = managers[msg.sender];
        manager.name = _name;
        emit ManagerEvent(_name);
    }
    
    function getManager() public view returns (address, bytes20, bytes20[]) {
        Manager storage manager = managers[msg.sender];
        return (msg.sender, manager.name, manager.devices);
    }
    
    function addDevice(bytes20 _deviceID, uint16 _deviceType) public {
        devices[_deviceID].deviceID = _deviceID;
        devices[_deviceID].deviceType = _deviceType;
        devices[_deviceID].owner = msg.sender;
        
        managers[msg.sender].devices.push(_deviceID);
        emit DeviceEvent(1, _deviceID);
    }
    
    function getDevice(bytes20 _deviceID) public view returns (bytes20, uint, address) {
        return (devices[_deviceID].deviceID, devices[_deviceID].deviceType, devices[_deviceID].owner);
    }
    
    function removeDevice(bytes20 _deviceID) public {
        require(devices[_deviceID].owner == msg.sender);
        delete(devices[_deviceID]);
    }
    
    function addAccess(bytes20 _deviceID, address _managerAddr, uint32 _startTime, uint32 _endTime) public onlyOwner(_deviceID) {
        devices[_deviceID].access[_managerAddr] = AccessRule(_managerAddr, _startTime, _endTime);
    }
    
    function getAccess(bytes20 _deviceID, address _managerAddr) public view returns (bool) {
        return devices[_deviceID].access[_managerAddr].manager == _managerAddr;
    }
    
    function removeAccess(bytes20 _deviceID, address _managerAddr) public onlyOwner(_deviceID) {
        delete(devices[_deviceID].access[_managerAddr]);
    }
    
}