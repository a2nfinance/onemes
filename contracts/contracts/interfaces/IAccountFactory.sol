// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../structs/Structs.sol";

/**
 * @title  Interface for AccountFactory.sol
 * @author levi@a2n.finance
 * @notice Change this interface before doing something in AccountFactory.sol
 */
interface IAccountFactory {
  // Event emitted when a new account is created.
  event CreateAccount(address, address, Structs.Account);

  // Event emitted when the AccountFactory contract settings are updated.
  event UpdateSettings(address, address, address, address);

  /**
   * @param account a struct of account information
   */
  function createAccount(Structs.Account memory account) external;

  /**
   *
   * @param __router CCIP router address
   * @param __linkToken link token address
   * @param __oneMesNaming address of OneMesNaming.sol
   * @param __functionConsumerAddress address of AutomatedFunctionsConsumer
   */
  function updateSettings(
    address __router,
    address __linkToken,
    address __oneMesNaming,
    address __functionConsumerAddress
  ) external;
}
