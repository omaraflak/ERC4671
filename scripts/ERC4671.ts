import { BigNumber, ethers } from "ethers";

class ERC4671 {
    contract: ethers.Contract

    constructor(contract: ethers.Contract) {
        this.contract = contract
    }

    private first(data) {
        return data[0]
    }

    // IERC4671
    balanceOf(owner: string): Promise<BigNumber> {
        return this.contract.functions.balanceOf(owner).then(this.first)
    }

    ownerOf(tokenId: number): Promise<string> {
        return this.contract.functions.ownerOf(tokenId).then(this.first)
    }

    isValid(tokenId: number): Promise<boolean> {
        return this.contract.functions.isValid(tokenId).then(this.first)
    }

    hasValid(owner: string): Promise<boolean> {
        return this.contract.functions.hasValid(owner).then(this.first)
    }

    // IERC4671Metadata
    name(): Promise<string> {
        return this.contract.functions.name().then(this.first)
    }

    symbol(): Promise<string> {
        return this.contract.functions.symbol().then(this.first)
    }

    tokenURI(tokenId: number): Promise<string> {
        return this.contract.functions.tokenURI(tokenId).then(this.first)
    }

    // IERC4671Enumerable
    emittedCount(): Promise<BigNumber> {
        return this.contract.functions.emittedCount().then(this.first)
    }

    holdersCount(): Promise<BigNumber> {
        return this.contract.functions.holdersCount().then(this.first)
    }

    tokenOfOwnerByIndex(owner: string, index: number): Promise<BigNumber> {
        return this.contract.functions.tokenOfOwnerByIndex(owner, index).then(this.first)
    }

    tokenByIndex(index: number): Promise<BigNumber> {
        return this.contract.functions.tokenByIndex(index).then(this.first)
    }

    // IERC4671Pull
    pull(tokenId: number, owner: string, signature: string): Promise<void> {
        return this.contract.functions.pull(tokenId, owner, signature).then(tx => tx.wait())
    }
}

export { ERC4671 }