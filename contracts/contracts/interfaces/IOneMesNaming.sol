// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title  Interface for OneMesNaming.sol
 * @author levi@a2n.finance
 * @notice Change this interface before doing something in OneMesNaming.sol
 */
interface IOneMesNaming {
  // Event emitted when a new friendly name is created
  event CreateName(string, address);

  /**
   *
   * @param name friendly name
   * @param accountAddress address of an AA contract.
   */
  function createName(string memory name, address accountAddress) external returns (string memory);

  /**
   * @param name a friendly name of an AA contract.
   */
  function getAddressByName(string memory name) external returns (address);
}
