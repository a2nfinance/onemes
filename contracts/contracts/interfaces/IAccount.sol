// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../structs/Structs.sol";

/**
 * @title  Interface for Account.sol
 * @author levi@a2n.finance
 * @notice Change this interface before doing something in Account.sol
 */
interface IAccount {
  // Event emitted when the user account is updated.
  event UpdateGeneralInfo(Structs.Account);

  // Event emitted when account settings are updated.
  event UpdateReceiverSetting(bool);

  // Event emitted when function consumer contract address is changed.
  event UpdateFunctionConsumerAddress(address);

  // Event emitted when users transfer native tokens & ERC-20 tokens on the same chain.
  event TransferToken(address, uint256);

  error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance.

  error FailedToWithdrawEth(address sender, uint256 amount);

  // Event emitted when a message is sent to another chain.
  event TokensTransferred(
    bytes32 indexed messageId, // The unique ID of the message.
    uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
    address receiver, // The address of the receiver on the destination chain.
    address token, // The token address that was transferred.
    uint256 tokenAmount, // The token amount that was transferred.
    address feeToken, // the token address used to pay CCIP fees.
    uint256 fees // The fees paid for sending the message.
  );

  /**
   * If an user update his account before a transfer pending request is executed,
   * then that request will be fail!
   * @param account new account info
   */
  function updateGeneralInfo(Structs.Account memory account) external;

  /**
   * Whether tokens will be transfered to AA contract or native wallet address
   * @param value true or false
   */
  function updateReceiverSetting(bool value) external;

  /**
   *
   * @param _functionConsumerAddress address of AutomatedFunctionsConsumer.sol
   */
  function updateFunctionConsumerAddress(address _functionConsumerAddress) external;

  /**
   *
   * @param _receiver receiver address, it can be an AA contract address or wallet address.
   * @param _token token address
   * @param _amount token amount
   * @param _destinationChainSelector ID of destination chain selector.
   */
  function transferTokensPayLink(
    address _receiver,
    address _token,
    uint256 _amount,
    uint64 _destinationChainSelector
  ) external returns (bytes32);

  /**
   *
   * @param _receiver receiver address, it can be an AA contract address or a wallet address.
   * @param _token token address
   * @param _amount token amount
   * @param _destinationChainSelector ID of the destination chain selector.
   */
  function transferTokensPayNative(
    address _receiver,
    address _token,
    uint256 _amount,
    uint64 _destinationChainSelector
  ) external returns (bytes32);

  function withdraw() external;

  function withdrawToken(address token) external;
}
