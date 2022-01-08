// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INTTDelegate {
    /// @notice Grant minting rights to `operator` for `owner`
    /// @param operator Address allowed to mint
    /// @param owner Address for whom `operator` is allowed to mint
    function delegate(address operator, address owner) external;

    /// @notice Mint a NTT
    /// @param owner Address for whom the NTT is minted
    function mint(address owner) external;
}