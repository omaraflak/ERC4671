// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface INTTMetadataStore is IERC165 {
    struct Metadata {
        string uri;
    }

    /// @notice Check if a token has metadata
    /// @param token Address of the token's contract
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return True if the token has metadata, false otherwise
    function hasMetadata(address token, address owner, uint256 index) external view returns (bool);

    /// @notice Get the metadata of a token
    /// @param token Address of the token's contract
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return Metadata of the token
    function getMetadata(address token, address owner, uint256 index) external view returns (Metadata memory);

    /// @notice Set the metadata of a token
    /// @param token Address of the token's contract
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    function setMetadata(address token, address owner, uint256 index, Metadata memory metadata) external;
}