// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./interfaces/IOneMesNaming.sol";
import "./structs/Structs.sol";

/**
 * @title  OneMes naming.
 * @author levi@a2n.finance
 * @notice this contract manages all friendly names.
 */
contract OneMesNaming is IOneMesNaming {
  mapping(string => Structs.NamingAccount) public nameMap;

  function createName(string memory _name, address _accountAddress) external returns (string memory) {
    if (!nameMap[_name].existed) {
      nameMap[_name].accountAddress = _accountAddress;
      emit CreateName(_name, _accountAddress);
      return _name;
    } else {
      return "";
    }
  }

  function getAddressByName(string memory _name) external view returns (address) {
    return nameMap[_name].accountAddress;
  }
}
