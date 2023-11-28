// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../structs/Structs.sol";

interface ICustomAutomatedFunction {
  event UpdatePendingTransferRequest();
  event UpdatePendingTransferRequests();

  function updatePendingTransferRequest(
    Structs.PendingTransferRequest calldata _pendingTransferRequest
  ) external returns (uint256);

  function updatePendingTransferRequests(Structs.PendingTransferRequest[] memory requests) external returns (uint256);
}
