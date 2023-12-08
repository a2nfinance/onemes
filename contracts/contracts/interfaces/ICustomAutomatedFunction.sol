// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../structs/Structs.sol";

/**
 * @title  Interface for AutomatedFunctionsConsumer.sol
 * @author levi@a2n.finance
 * @notice Change this interface before doing something in AutomatedFunctionsConsumer.sol
 */
interface ICustomAutomatedFunction {
  event UpdatePendingTransferRequest(uint256);
  event UpdatePendingTransferRequests(uint256);
  event DeletePendingTransferRequest(uint256);
  event ClearPendingTransferRequests(uint256);

  /**
   * This function will be called from OneMes cron-job.
   * @param _pendingTransferRequest struct of a pending transfer request
   */
  function updatePendingTransferRequest(
    Structs.PendingTransferRequest calldata _pendingTransferRequest
  ) external returns (uint256);

  /**
   * This function will be called from OneMes cron-job.
   * @param requests array of struct of a pending transfer requests
   */
  function updatePendingTransferRequests(Structs.PendingTransferRequest[] memory requests) external returns (uint256);

  /**
   * Delete a pending transfer request
   * @param index index of request
   */
  function deletePendingTransferRequest(uint256 index) external;

 /**
  * Clear all pending transfer requests
  */
  function clearPendingTransferRequests() external;
}
