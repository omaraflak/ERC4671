// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./INTTStore.sol";

contract NTTStore is INTTStore, ERC165 {
    // Mapping from owner to NTT contracts
    mapping(address => address[]) private _records;

    // Mapping from owner to NTT contract index
    mapping(address => mapping(address => uint256)) _indices;

    /// @notice Add a NTT contract address to the caller's record
    /// @param ntt Address of the NTT contract to add
    function add(address ntt) public virtual override {
        address[] storage contracts = _records[msg.sender];
        _indices[msg.sender][ntt] = contracts.length;
        contracts.push(ntt);
    }

    /// @notice Remove a NTT contract from the caller's record
    /// @param ntt Address of the NTT contract to remove
    function remove(address ntt) public virtual override {
        uint256 index = _indexOfNTT(msg.sender, ntt);
        require(index >= 0, "Address not found");
        address[] storage contracts = _records[msg.sender];
        contracts[index] = contracts[contracts.length - 1];
        contracts.pop();
    }

    /// @notice Get all the NTT contracts for a given owner
    /// @param owner Address for which to retrieve the NTT contracts
    function get(address owner) public view virtual override returns (address[] memory) {
        return _records[owner];
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(INTTStore).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _indexOfNTT(address owner, address ntt) private view returns (uint256) {
        return _indices[owner][ntt];
    }
}