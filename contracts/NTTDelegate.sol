// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./INTTDelegate.sol";
import "./NTT.sol";

abstract contract NTTDelegate is NTT, INTTDelegate {
    // Mapping from operator to list of owners
    mapping (address => mapping(address => bool)) _allowed;

    /// @notice Grant one-time minting right to `operator` for `owner`
    /// An allowed delegate can call the function to transfer rights.
    /// @param operator Address allowed to mint
    /// @param owner Address for whom `operator` is allowed to mint
    function delegate(address operator, address owner) public virtual override {
        bool isCreator = _isCreator();
        require(
            isCreator || _allowed[msg.sender][owner],
            "Only contract creator can call this function"
        );
        if (!isCreator) {
            _allowed[msg.sender][owner] = false;
        }
        _allowed[operator][owner] = true;
    }

    /// @notice Mint a NTT
    /// @param owner Address for whom the NTT is minted
    function mint(address owner) public virtual override {
        bool isCreator = _isCreator();
        require(
            isCreator || _allowed[msg.sender][owner],
            "Only contract creator or delegate are allowed to mint"
        );
        _mint(owner);
        if (!isCreator) {
            _allowed[msg.sender][owner] = false;
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(NTT) returns (bool) {
        return 
            interfaceId == type(INTTDelegate).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}