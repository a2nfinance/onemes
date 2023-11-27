// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "./structs/Structs.sol";
import "./interfaces/IAccount.sol";

contract AutomatedFunctionsConsumer is FunctionsClient, AutomationCompatibleInterface, ConfirmedOwner {
  using FunctionsRequest for FunctionsRequest.Request;
  address public upkeepContract;
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

  modifier onlyAllowed() {
    if (msg.sender != owner() && msg.sender != upkeepContract)
      revert NotAllowedCaller(msg.sender, owner(), upkeepContract);
    _;
  }

  function updatePendingTransferRequest(
    address accountAddress,
    address toAddress,
    address tokenAddress,
    uint256 amount,
    uint64 destinationChainSelector
  ) external onlyOwner returns (uint256) {
    Structs.PendingTransferRequest memory pendingTranferRequest = Structs.PendingTransferRequest(
      accountAddress,
      toAddress,
      tokenAddress,
      amount,
      destinationChainSelector
    );
    _pendingTransferRequests.push(pendingTranferRequest);
    return _pendingTransferRequests.length;
  }

  function setAutomationCronContract(address _upkeepContract) external onlyOwner {
    upkeepContract = _upkeepContract;
  }

  function updateRequest(
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

  function checkUpkeep(
    bytes calldata /* checkData */
  ) external view override returns (bool upkeepNeeded, bytes memory performData) {
    upkeepNeeded = _pendingTransferRequests.length > 0;
    return (upkeepNeeded, "");
  }

  function performUpkeep(bytes calldata /* performData */) external override {
    if (_pendingTransferRequests.length > 0) {
      // Call to account contract here
      for (uint256 i = 0; i < _pendingTransferRequests.length; i++) {
        IAccount(_pendingTransferRequests[i].accountAddress).transferTokensPayLink(
          _pendingTransferRequests[i].toAddress,
          _pendingTransferRequests[i].tokenAddress,
          _pendingTransferRequests[i].amount,
          _pendingTransferRequests[i].destinationChainSelector
        );
      }
      // Post to notification
      // FunctionsRequest.Request memory req;
      // req = request.decodeCBOR();

      // req.setArgs(_pendingTransferRequests);
      // s_lastRequestId = _sendRequest(request, subscriptionId, gasLimit, donID);
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
