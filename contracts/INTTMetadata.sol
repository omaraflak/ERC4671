// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./INTTMetadataStore.sol";

interface INTTMetadata {
    /// @return Descriptive name of the tokens in this contract
    function name() external view returns (string memory);

    /// @return An abbreviated name of the tokens in this contract
    function symbol() external view returns (string memory);

    /// @return Address of the metadata store
    function store() external view returns (address);

    /// @notice Chek if a token has metadata
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return True if the token has an entry in the metadata store, false otherwise
    function hasMetadata(address owner, uint256 index) external view returns (bool);

    /// @notice Get the metadata of a token from the metadata store
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return Metadata of the token
    function getMetadata(address owner, uint256 index) external view returns (INTTMetadataStore.Metadata memory);

    /// @notice Set the metadata of a token
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @param metadata Metadata to set
    function setMetadata(address owner, uint256 index, INTTMetadataStore.Metadata memory metadata) external;
}