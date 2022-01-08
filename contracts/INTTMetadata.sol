// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INTTMetadata {
    /// @return Descriptive name of the tokens in this contract
    function name() external view returns (string memory);

    /// @return An abbreviated name of the tokens in this contract
    function symbol() external view returns (string memory);

    /// @notice Fetch link containing information for a token
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return Link to query for the token's data
    function uri(address owner, uint256 index) external view returns (string memory);
}