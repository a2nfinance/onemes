// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Structs {
  struct Account {
    address accountAddress;
    bool existed;
  }

  struct PendingTransferRequest {
    address accountAddress;
    address toAddress;
    address tokenAddress;
    uint256 amount;
    uint64 destinationChainSelector;
  }
}
