// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INTTMetadata {
    /// @return Descriptive name of the NTTs in this contract
    function name() external view returns (string memory);

    /// @return An abbreviated name of the NTTs in this contract
    function symbol() external view returns (string memory);

    /// @notice Fetch API link containing information for an NTT
    /// @param owner Address of the NTT's owner
    /// @param index Index of the NTT
    /// @return API link to query for the NTT
    function uri(address owner, uint256 index) external view returns (string memory);
}