// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./IERC4671Store.sol";

contract ERC4671Store is IERC4671Store, ERC165 {
    // Mapping from owner to ERC4671 contracts
    mapping(address => address[]) private _records;

    // Mapping from owner to ERC4671 contract index
    mapping(address => mapping(address => uint256)) _indices;

    /// @notice Add a ERC4671 contract address to the caller's record
    /// @param _contract Address of the ERC4671 contract to add
    function add(address _contract) public virtual override {
        address[] storage contracts = _records[msg.sender];
        _indices[msg.sender][_contract] = contracts.length;
        contracts.push(_contract);
        emit Added(msg.sender, _contract);
    }

    /// @notice Remove a ERC4671 contract from the caller's record
    /// @param _contract Address of the ERC4671 contract to remove
    function remove(address _contract) public virtual override {
        uint256 index = _indexOfTokenOrRevert(msg.sender, _contract);
        address[] storage contracts = _records[msg.sender];
        if (index == contracts.length - 1) {
            _indices[msg.sender][_contract] = 0;
        } else {
            _indices[msg.sender][contracts[contracts.length - 1]] = index;
        }
        contracts[index] = contracts[contracts.length - 1];
        contracts.pop();
        emit Removed(msg.sender, _contract);
    }

    /// @notice Get all the ERC4671 contracts for a given owner
    /// @param owner Address for which to retrieve the ERC4671 contracts
    function get(address owner) public view virtual override returns (address[] memory) {
        return _records[owner];
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(IERC4671Store).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _indexOfTokenOrRevert(address owner, address _contract) private view returns (uint256) {
        uint256 index = _indices[owner][_contract];
        require(index > 0 || _records[owner].length > 0, "Address not found");
        return index;
    }
}