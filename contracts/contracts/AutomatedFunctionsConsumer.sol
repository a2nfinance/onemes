// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "./structs/Structs.sol";
import "./interfaces/IAccount.sol";
import "./interfaces/ICustomAutomatedFunction.sol";

contract AutomatedFunctionsConsumer is
  ICustomAutomatedFunction,
  FunctionsClient,
  AutomationCompatibleInterface,
  ConfirmedOwner
{
  using FunctionsRequest for FunctionsRequest.Request;
  address public upkeepContract;
  string public source;
  bytes public request;
  uint64 public subscriptionId;
  uint32 public gasLimit;
  bytes32 public donID;
  bytes32 public s_lastRequestId;
  bytes public s_lastResponse;
  bytes public s_lastError;

  Structs.PendingTransferRequest[] private _pendingTransferRequests;

  error NotAllowedCaller(address caller, address owner, address automationRegistry);

  error UnexpectedRequestID(bytes32 requestId);

  event Response(bytes32 indexed requestId, bytes response, bytes err);

  constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

  receive() external payable {}

  function updatePendingTransferRequest(
    Structs.PendingTransferRequest calldata _pendingTransferRequest
  ) external override onlyOwner returns (uint256) {
    _pendingTransferRequests.push(_pendingTransferRequest);
    emit UpdatePendingTransferRequest();
    return _pendingTransferRequests.length;
  }

  function updatePendingTransferRequests(
    Structs.PendingTransferRequest[] memory requests
  ) external override onlyOwner returns (uint256) {
    for (uint256 i = 0; i < requests.length; i++) {
      _pendingTransferRequests.push(requests[i]);
    }

    emit UpdatePendingTransferRequests();
    return _pendingTransferRequests.length;
  }

  function deletePendingTransferRequest(uint256 index) external override onlyOwner {
    delete _pendingTransferRequests[index];
    emit DeletePendingTransferRequest();
  }

  function clearPendingTransferRequests() external override onlyOwner {
    delete _pendingTransferRequests;
    emit ClearPendingTransferRequests();
  }

  function sendRequest(string[] memory args, bytes[] memory bytesArgs) internal returns (bytes32 requestId) {
    FunctionsRequest.Request memory req;
    req.initializeRequestForInlineJavaScript(source);
    if (args.length > 0) req.setArgs(args);
    if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
    s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
    return s_lastRequestId;
  }

  function updateRequestCBOR(
    bytes memory _request,
    uint64 _subscriptionId,
    uint32 _gasLimit,
    bytes32 _donID
  ) external onlyOwner {
    request = _request;
    subscriptionId = _subscriptionId;
    gasLimit = _gasLimit;
    donID = _donID;
  }

  function updateRequest(
    string memory _source,
    uint64 _subscriptionId,
    uint32 _gasLimit,
    bytes32 _donID
  ) external onlyOwner {
    source = _source;
    subscriptionId = _subscriptionId;
    gasLimit = _gasLimit;
    donID = _donID;
  }

  function checkUpkeep(
    bytes calldata /* checkData */
  ) external view override returns (bool upkeepNeeded, bytes memory performData) {
    upkeepNeeded = _pendingTransferRequests.length > 0;
    return (upkeepNeeded, "");
  }

  function performUpkeep(bytes calldata /* performData */) external override {
    if (_pendingTransferRequests.length > 0) {
      string[] memory requestIds = new string[](_pendingTransferRequests.length);
      // Call to account contract here
      for (uint256 i = 0; i < _pendingTransferRequests.length; i++) {
        IAccount(_pendingTransferRequests[i].accountAddress).transferTokensPayLink(
          _pendingTransferRequests[i].toAddress,
          _pendingTransferRequests[i].tokenAddress,
          _pendingTransferRequests[i].amount,
          _pendingTransferRequests[i].destinationChainSelector
        );
        requestIds[i] = _pendingTransferRequests[i].requestId;
      }

      sendRequest(requestIds, new bytes[](0));

      delete _pendingTransferRequests;
    }
  }

  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    if (s_lastRequestId != requestId) {
      revert UnexpectedRequestID(requestId);
    }
    s_lastResponse = response;
    s_lastError = err;
    emit Response(requestId, s_lastResponse, s_lastError);
  }
}
