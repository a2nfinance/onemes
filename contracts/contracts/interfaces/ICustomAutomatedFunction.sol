// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../structs/Structs.sol";

interface ICustomAutomatedFunction {
  event UpdatePendingTransferRequest();
  event UpdatePendingTransferRequests();
  event DeletePendingTransferRequest();
  event ClearPendingTransferRequests();

  function updatePendingTransferRequest(
    Structs.PendingTransferRequest calldata _pendingTransferRequest
  ) external returns (uint256);

  function updatePendingTransferRequests(Structs.PendingTransferRequest[] memory requests) external returns (uint256);

  function deletePendingTransferRequest(uint256 index) external;

  function clearPendingTransferRequests() external;
}
