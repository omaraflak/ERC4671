// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface INTTStore is IERC165 {
    /// @notice Add a NTT contract address to the caller's record
    /// @param ntt Address of the NTT contract to add
    function add(address ntt) external;

    /// @notice Remove a NTT contract from the caller's record
    /// @param ntt Address of the NTT contract to remove
    function remove(address ntt) external;

    /// @notice Get all the NTT contracts for a given owner
    /// @param owner Address for which to retrieve the NTT contracts
    function get(address owner) external view returns (address[] memory);
}