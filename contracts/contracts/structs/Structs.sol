// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Structs {
  struct Account {
    string name;
    string email;
    string phoneNumber;
    string twitter;
    string telegram;
    bool use_wallet_address_to_receive;
  }
  struct NamingAccount {
    address accountAddress;
    bool existed;
  }

  struct PendingTransferRequest {
    string requestId;
    address accountAddress;
    address toAddress;
    address tokenAddress;
    uint256 amount;
    uint64 destinationChainSelector;
  }
}
