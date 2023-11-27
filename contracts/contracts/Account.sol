// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./interfaces/IAccount.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";

contract Account is IAccount {
  string private _name;
  string private _email;
  string private _phoneNumber;
  string private _twitter;
  string private _telegram;
  address public owner;

  // ChainlinkRouter

  IRouterClient private s_router;

  LinkTokenInterface private s_linkToken;

  // Modifier

  modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
  }

  //Contructor
  constructor(
    string memory __name,
    string memory __email,
    string memory __phoneNumber,
    string memory __twitter,
    string memory __telegram,
    address _router,
    address _link,
    address _owner
  ) {
    _name = __name;
    _email = __email;
    _phoneNumber = __phoneNumber;
    _twitter = __twitter;
    _telegram = __telegram;
    owner = _owner;
    s_router = IRouterClient(_router);
    s_linkToken = LinkTokenInterface(_link);
  }


function transferTokensPayNative(
    address _receiver,
    address _token,
    uint256 _amount,
    uint64 _destinationChainSelector
  ) external override returns (bytes32 messageId) {
    // Need to assert some conditions here

    if (_destinationChainSelector != 0) {
      Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _token,
            _amount,
            address(0)
        );

        // Get the fee required to send the message
        uint256 fees = s_router.getFee(
            _destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > address(this).balance)
            revert NotEnoughBalance(address(this).balance, fees);

        // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
        IERC20(_token).approve(address(s_router), _amount);

        // Send the message through the router and store the returned message ID
        messageId = s_router.ccipSend{value: fees}(
            _destinationChainSelector,
            evm2AnyMessage
        );

        // Emit an event with message details
        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _token,
            _amount,
            address(0),
            fees
        );

        // Return the message ID
        return messageId;
    } else {
      if (_token == address(0)) {
        payable(_receiver).transfer(_amount);
      } else {
        IERC20(_token).transfer(_receiver, _amount);
      }
      emit TransferToken();
      return 0;
    }
  }

  function transferTokensPayLink(
    address _receiver,
    address _token,
    uint256 _amount,
    uint64 _destinationChainSelector
  ) external override returns (bytes32 messageId) {
    // Need to assert some conditions here

    if (_destinationChainSelector != 0) {
      // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
      Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
        _receiver,
        _token,
        _amount,
        address(s_linkToken)
      );

      // Get the fee required to send the message
      uint256 fees = s_router.getFee(_destinationChainSelector, evm2AnyMessage);

      if (fees > s_linkToken.balanceOf(address(this)))
        revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
      
      s_linkToken.approve(address(s_router), fees);

      // Approve the Router to transfer the tokens on contract's behalf.
      IERC20(_token).approve(address(s_router), _amount);

      // Send the message through the router and store the returned message ID
      messageId = s_router.ccipSend(_destinationChainSelector, evm2AnyMessage);

      // Emit an event with message details
      emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _token,
            _amount,
            address(s_linkToken),
            fees
        );

      // Return the message ID
      return messageId;
    } else {
      if (_token == address(0)) {
        payable(_receiver).transfer(_amount);
      } else {
        IERC20(_token).transfer(_receiver, _amount);
      }
      emit TransferToken();
      return 0;
    }
  }

  function updateAccount(string memory attribute, string memory value) external override {}

  // @notice Construct a CCIP message.
  /// @dev This function will create an EVM2AnyMessage struct with all the necessary information for tokens transfer.
  /// @param _receiver The address of the receiver.
  /// @param _token The token to be transferred.
  /// @param _amount The amount of the token to be transferred.
  /// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
  /// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
  function _buildCCIPMessage(
    address _receiver,
    address _token,
    uint256 _amount,
    address _feeTokenAddress
  ) internal pure returns (Client.EVM2AnyMessage memory) {
    // Set the token amounts
    Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
    tokenAmounts[0] = Client.EVMTokenAmount({token: _token, amount: _amount});

    // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
    return
      Client.EVM2AnyMessage({
        receiver: abi.encode(_receiver), // ABI-encoded receiver address
        data: "", // No data
        tokenAmounts: tokenAmounts, // The amount and type of token being transferred
        extraArgs: Client._argsToBytes(
          // Additional arguments, setting gas limit to 0 as we are not sending any data and non-strict sequencing mode
          Client.EVMExtraArgsV1({gasLimit: 0, strict: false})
        ),
        // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
        feeToken: _feeTokenAddress
      });
  }

  /// @notice Fallback function to allow the contract to receive Ether.
  /// @dev This function has no function body, making it a default function for receiving Ether.
  /// It is automatically called when Ether is sent to the contract without any data.
  receive() external payable {}

  /// @notice Allows the contract owner to withdraw the entire balance of Ether from the contract.
  /// @dev This function reverts if there are no funds to withdraw or if the transfer fails.
  /// It should only be callable by the owner of the contract.
  function withdraw() external onlyOwner {
    // Retrieve the balance of this contract
    uint256 amount = address(this).balance;

    // Attempt to send the funds, capturing the success status and discarding any return data
    (bool sent, ) = msg.sender.call{value: amount}("");

    // Revert if the send failed, with information about the attempted transfer
    if (!sent) revert FailedToWithdrawEth(msg.sender, amount);
  }

  function withdrawToken(address token) external onlyOwner {
    // Retrieve the balance of this contract
    uint256 amount = IERC20(token).balanceOf(address(this));
    IERC20(token).transfer(msg.sender, amount);
  }
}
