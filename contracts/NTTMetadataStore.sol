// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./INTTMetadataStore.sol";

contract NTTMetadataStore is INTTMetadataStore, ERC165 {
    mapping (address => mapping(address => mapping(uint256 => INTTMetadataStore.Metadata))) _metadata;

    /// @notice Check if a token has metadata
    /// @param token Address of the token's contract
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return True if the token has metadata, false otherwise
    function hasMetadata(address token, address owner, uint256 index) external view virtual override returns (bool) {
        return _metadata[token][owner][index]._flag;
    }

    /// @notice Get the metadata of a token
    /// @param token Address of the token's contract
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    /// @return Metadata of the token
    function getMetadata(address token, address owner, uint256 index) external view virtual override returns (INTTMetadataStore.Metadata memory) {
        return _metadata[token][owner][index];
    }

    /// @notice Set the metadata of a token
    /// @param token Address of the token's contract
    /// @param owner Address of the token's owner
    /// @param index Index of the token
    function setMetadata(address token, address owner, uint256 index, INTTMetadataStore.Metadata memory metadata) external virtual override {
        require(msg.sender == owner, "You must be the owner of the token");
        _metadata[token][owner][index] = metadata;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(INTTMetadataStore).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}