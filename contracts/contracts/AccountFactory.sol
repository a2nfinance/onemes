// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./interfaces/IAccountFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Account.sol";
import "./interfaces/IOneMesNaming.sol";
import "./structs/Structs.sol";

contract AccountFactory is IAccountFactory, Ownable {
  // ChainlinkRouter

  address private _router;

  address private _linkToken;

  IOneMesNaming private _oneMesNaming;

  function createAccount(Structs.Account memory account) external override {
    // Create account contract

    Account createdAccount = new Account(account, _router, _linkToken, msg.sender);

    _oneMesNaming.createName(account.name, address(createdAccount));

    emit CreateAccount(msg.sender, address(createdAccount), account);
  }

  function updateSettings(address __router, address __linkToken, address __oneMesNaming) external override onlyOwner {
    _router = __router;
    _linkToken = __linkToken;
    _oneMesNaming = IOneMesNaming(__oneMesNaming);
    emit UpdateSettings(__router, __linkToken, __oneMesNaming);
  }
}
