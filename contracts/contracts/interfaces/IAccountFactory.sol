// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IAccountFactory {
  event CreateAccount(address, string);

  function createAccount(
    string memory name,
    string memory email,
    string memory phoneNumber,
    string memory twitter,
    string memory telegram
  ) external returns (address, string memory);
}
