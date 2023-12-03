// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../structs/Structs.sol";

interface IAccountFactory {
  event CreateAccount(address, address, Structs.Account);
  event UpdateSettings(address, address, address, address);

  function createAccount(Structs.Account memory account) external;

  function updateSettings(address __router, address __linkToken, address __oneMesNaming, address __functionConsumerAddress) external;
}
