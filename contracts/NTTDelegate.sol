// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./INTTDelegate.sol";
import "./NTT.sol";

abstract contract NTTDelegate is NTT, INTTDelegate {
    // Mapping from operator to list of owners
    mapping (address => mapping(address => bool)) _allowed;

    /// @notice Grant one-time minting right to `operator` for `owner`
    /// An allowed operator can call the function to transfer rights.
    /// @param operator Address allowed to mint
    /// @param owner Address for whom `operator` is allowed to mint
    function delegate(address operator, address owner) public virtual override {
        _delegateAsDelegateOrCreator(operator, owner, _isCreator());
    }

    /// @notice Grant one-time minting right to a list of `operators` for a corresponding list of `owners`
    /// An allowed operator can call the function to transfer rights.
    /// @param operators Addresses allowed to mint
    /// @param owners Addresses for whom `operators` are allowed to mint
    function delegateBatch(address[] memory operators, address[] memory owners) public virtual override {
        require(operators.length == owners.length, "operators and owners must have the same length");
        bool isCreator = _isCreator();
        for (uint i=0; i<operators.length; i++) {
            _delegateAsDelegateOrCreator(operators[i], owners[i], isCreator);
        }
    }

    /// @notice Mint a token. Caller must have the right to mint for the owner.
    /// @param owner Address for whom the token is minted
    function mint(address owner) public virtual override {
        _mintAsDelegateOrCreator(owner, _isCreator());
    }

    /// @notice Mint tokens to multiple addresses. Caller must have the right to mint for all owners.
    /// @param owners Addresses for whom the tokens are minted
    function mintBatch(address[] memory owners) public virtual override {
        bool isCreator = _isCreator();
        for (uint i=0 ; i<owners.length; i++) {
            _mintAsDelegateOrCreator(owners[i], isCreator);
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(NTT) returns (bool) {
        return 
            interfaceId == type(INTTDelegate).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _delegateAsDelegateOrCreator(address operator, address owner, bool isCreator) private {
        require(
            isCreator || _allowed[msg.sender][owner],
            "Only contract creator or allowed operator can delegate"
        );
        if (!isCreator) {
            _allowed[msg.sender][owner] = false;
        }
        _allowed[operator][owner] = true;
    }

    function _mintAsDelegateOrCreator(address owner, bool isCreator) private {
        require(
            isCreator || _allowed[msg.sender][owner],
            "Only contract creator or allowed operator can mint"
        );
        if (!isCreator) {
            _allowed[msg.sender][owner] = false;
        }
        _mint(owner);
    }
}