// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./IERC4671Store.sol";

contract ERC4671Store is IERC4671Store, ERC165 {
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
        emit Added(msg.sender, ntt);
    }

    /// @notice Remove a NTT contract from the caller's record
    /// @param ntt Address of the NTT contract to remove
    function remove(address ntt) public virtual override {
        uint256 index = _indexOfNTTOrRevert(msg.sender, ntt);
        address[] storage contracts = _records[msg.sender];
        if (index == contracts.length - 1) {
            _indices[msg.sender][ntt] = 0;
        } else {
            _indices[msg.sender][contracts[contracts.length - 1]] = index;
        }
        contracts[index] = contracts[contracts.length - 1];
        contracts.pop();
        emit Removed(msg.sender, ntt);
    }

    /// @notice Get all the NTT contracts for a given owner
    /// @param owner Address for which to retrieve the NTT contracts
    function get(address owner) public view virtual override returns (address[] memory) {
        return _records[owner];
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(IERC4671Store).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _indexOfNTTOrRevert(address owner, address ntt) private view returns (uint256) {
        uint256 index = _indices[owner][ntt];
        require(index > 0 || _records[owner].length > 0, "Address not found");
        return index;
    }
}