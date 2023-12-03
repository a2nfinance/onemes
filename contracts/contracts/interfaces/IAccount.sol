// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../structs/Structs.sol";

interface IAccount {
  event UpdateGeneralInfo(Structs.Account);

  event UpdateReceiverSetting(bool);

  event UpdateFunctionConsumerAddress(address);

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

  function updateGeneralInfo(Structs.Account memory account) external;

  function updateReceiverSetting(bool value) external;

  function updateFunctionConsumerAddress(address _functionConsumerAddress) external;

  function transferTokensPayLink(
    address _receiver,
    address _token,
    uint256 _amount,
    uint64 _destinationChainSelector
  ) external returns (bytes32);

  function transferTokensPayNative(
    address _receiver,
    address _token,
    uint256 _amount,
    uint64 _destinationChainSelector
  ) external returns (bytes32);

  function withdraw() external;

  function withdrawToken(address token) external;
}
