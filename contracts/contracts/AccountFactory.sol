// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./interfaces/IAccountFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Account.sol";
import "./interfaces/IOneMesNaming.sol";

contract AccountFactory is IAccountFactory, Ownable {
  // ChainlinkRouter

  address private _router;

  address private _linkToken;

  IOneMesNaming private _oneMesNaming;

  function createAccount(
    string memory _name,
    string memory _email,
    string memory _phoneNumber,
    string memory _twitter,
    string memory _telegram
  ) external returns (address, string memory) {
    // Create account contract

    Account account = new Account(_name, _email, _phoneNumber, _twitter, _telegram, _router, _linkToken, msg.sender);

    // Regis a custom name

    string memory customName = _oneMesNaming.createName(_name, address(account));

    return (address(account), customName);
  }

  function init(address __router, address __linkToken, address __oneMesNaming) external onlyOwner {
    _router = __router;
    _linkToken = __linkToken;
    _oneMesNaming = IOneMesNaming(__oneMesNaming);
  }
}
