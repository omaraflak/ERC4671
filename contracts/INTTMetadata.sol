// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INTTMetadata {
    /// @return Descriptive name of the tokens in this contract
    function name() external view returns (string memory);

    /// @return An abbreviated name of the tokens in this contract
    function symbol() external view returns (string memory);

    /// @notice URI to query to get the token's metadata
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return URI for the token
    function tokenURI(address owner, uint256 index) external view returns (string memory);

    /// @return Total number of tokens emited by the contract
    function total() external view returns (uint256);
}