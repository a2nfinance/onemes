// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAccountFactory.sol";
import "./Account.sol";
import "./interfaces/IOneMesNaming.sol";
import "./structs/Structs.sol";

/**
 * @title  AccountFactory contract.
 * @author levi@a2n.finance
 * @notice this contract to create new account and generate new friendly name.
 */
contract AccountFactory is IAccountFactory, Ownable {
  // Chainlink CCIP router
  address private _router;
  // Link token
  address private _linkToken;
  // Address of AutomatedFunctionsConsumer.sol
  address private _functionConsumerAddress;

  IOneMesNaming private _oneMesNaming;

  function createAccount(Structs.Account memory account) external override {
    // Create account contract
    Account createdAccount = new Account(account, _router, _linkToken, _functionConsumerAddress, msg.sender);

    // Create new friendly name
    _oneMesNaming.createName(account.name, address(createdAccount));

    emit CreateAccount(msg.sender, address(createdAccount), account);
  }

  function updateSettings(
    address __router,
    address __linkToken,
    address __oneMesNaming,
    address __functionConsumerAddress
  ) external override onlyOwner {
    _router = __router;
    _linkToken = __linkToken;
    _functionConsumerAddress = __functionConsumerAddress;
    _oneMesNaming = IOneMesNaming(__oneMesNaming);
    emit UpdateSettings(__router, __linkToken, __oneMesNaming, __functionConsumerAddress);
  }
}
