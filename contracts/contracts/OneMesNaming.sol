// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./interfaces/IOneMesNaming.sol";
import "./structs/Structs.sol";

contract OneMesNaming is IOneMesNaming {
  mapping(string => Structs.Account) public nameMap;

  function createName(string memory _name, address _accountAddress) external returns (string memory) {
    if (!nameMap[_name].existed) {
      nameMap[_name].accountAddress = _accountAddress;
      return _name;
    } else {
      return "";
    }
  }

  function getAddressByName(string memory _name) external view returns (address) {
    return nameMap[_name].accountAddress;
  }
}
