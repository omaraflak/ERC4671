// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./INTTDelegate.sol";
import "./NTT.sol";

abstract contract NTTDelegate is NTT, INTTDelegate {
    // Mapping from operator to list of owners
    mapping (address => mapping(address => bool)) _allowed;

    /// @notice Grant minting rights to `operator` for `owner`
    /// @param operator Address allowed to mint
    /// @param owner Address for whom `operator` is allowed to mint
    function delegate(address operator, address owner) public virtual override {
        require(msg.sender == _creator, "Only contract creator can call this function");
        _allowed[operator][owner] = true;
    }

    /// @notice Remove minting rights of `operator` for `owner`
    /// @param operator Address for whom to remove the right to mint
    /// @param owner Address for whom `operator` is not allowed to mint
    function undelegate(address operator, address owner) public virtual override {
        require(msg.sender == _creator, "Only contract creator can call this function");
        _allowed[operator][owner] = false;
    }

    /// @notice Mint a NTT
    /// @param owner Address for whom the NTT is minted
    function mint(address owner) public virtual override {
        require(
            msg.sender == _creator || _allowed[msg.sender][owner],
            "Only contract creator or delegate are allowed to mint"
        );
        _mint(owner);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(NTT) returns (bool) {
        return 
            interfaceId == type(INTTDelegate).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}