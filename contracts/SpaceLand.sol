pragma solidity ^0.4.24;

import "./ERC721Enumerable.sol";


contract SpaceLand is ERC721Enumerable {

  struct LandMeta {
    uint256 rows;
    uint256 columns;
    uint256 height;
    uint256 width;
    uint256 price;
  }

  struct LandDetails {
    string name;
    string desc;
  }

  address public owner;
  
  LandMeta private _landMeta;
  mapping (uint256 => LandDetails) private _landsDetails;

  constructor(uint256 rows, uint256 columns, uint256 landHeight, uint256 landWidth, uint256 landPrice) public {
    owner = msg.sender;
    _landMeta = LandMeta(rows, columns, landHeight, landWidth, landPrice);
  }

  modifier validLandPrice() {
    require(msg.value == _landMeta.price, "[msg.value not equal to expected land price]");
    _;
  }

  modifier validLandId(uint256 landId) {
    require(landId < (_landMeta.rows * _landMeta.columns), "[landId greater than max avaiable index]");
    _;
  }

  function buy(uint256 landId) public payable validLandPrice validLandId(landId) {
    _mint(msg.sender, landId);
  }

  function setDetails(uint256 landId, string name, string desc) public returns (uint256) {
    require(ownerOf(landId) == msg.sender, "[landId is not owned by message sender]");
    
    LandDetails storage details = _landsDetails[landId];
    details.name = name;
    details.desc = desc;

    return 1;
  }

  function getDetails(uint256 landId) public view returns (uint256, string, string) {
    LandDetails storage details = _landsDetails[landId];
    return (landId, details.name, details.desc);
  }

  function allLands() public view returns (uint256[]) {
    return _tokensAll();
  }

  function landsOf(address buyer) public view returns (uint256[]) {
    require(buyer != address(0));
    return _tokensOf(buyer);
  }

  function maxTotalSupply() public view returns (uint256) {
    return _landMeta.rows * _landMeta.columns;
  }
}
