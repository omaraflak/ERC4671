// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IERC4671Store is IERC165 {
    // Event emitted when a ERC4671 contract is added to the owner's records
    event Added(address owner, address _contract);

    // Event emitted when a ERC4671 contract is removed from the owner's records
    event Removed(address owner, address _contract);

    /// @notice Add a ERC4671 contract address to the caller's record
    /// @param _contract Address of the ERC4671 contract to add
    function add(address _contract) external;

    /// @notice Remove a ERC4671 contract from the caller's record
    /// @param _contract Address of the ERC4671 contract to remove
    function remove(address _contract) external;

    /// @notice Get all the ERC4671 contracts for a given owner
    /// @param owner Address for which to retrieve the ERC4671 contracts
    function get(address owner) external view returns (address[] memory);
}