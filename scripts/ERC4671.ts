import { BigNumber, ethers } from "ethers";

class ERC4671 {
    contract: ethers.Contract

    constructor(contract: ethers.Contract) {
        this.contract = contract
    }

    private async first(data) {
        return data[0]
    }

    private async wait(tx) {
        return tx.wait()
    }

    // IERC4671
    async balanceOf(owner: string): Promise<BigNumber> {
        return this.contract.functions.balanceOf(owner).then(this.first)
    }

    async ownerOf(tokenId: number): Promise<string> {
        return this.contract.functions.ownerOf(tokenId).then(this.first)
    }

    async isValid(tokenId: number): Promise<boolean> {
        return this.contract.functions.isValid(tokenId).then(this.first)
    }

    async hasValid(owner: string): Promise<boolean> {
        return this.contract.functions.hasValid(owner).then(this.first)
    }

    // IERC4671Metadata
    async name(): Promise<string> {
        return this.contract.functions.name().then(this.first)
    }

    async symbol(): Promise<string> {
        return this.contract.functions.symbol().then(this.first)
    }

    async tokenURI(tokenId: number): Promise<string> {
        return this.contract.functions.tokenURI(tokenId).then(this.first)
    }

    // IERC4671Enumerable
    async emittedCount(): Promise<BigNumber> {
        return this.contract.functions.emittedCount().then(this.first)
    }

    async holdersCount(): Promise<BigNumber> {
        return this.contract.functions.holdersCount().then(this.first)
    }

    async tokenOfOwnerByIndex(owner: string, index: number): Promise<BigNumber> {
        return this.contract.functions.tokenOfOwnerByIndex(owner, index).then(this.first)
    }

    async tokenByIndex(index: number): Promise<BigNumber> {
        return this.contract.functions.tokenByIndex(index).then(this.first)
    }

    // IERC4671Pull
    async pull(tokenId: number, owner: string, signature: string): Promise<void> {
        return this.contract.functions.pull(tokenId, owner, signature).then(this.wait)
    }

    // IERC4671Concensus
    async voters(): Promise<string[]> {
        return this.contract.functions.voters().then(this.first)
    }

    async approveMint(owner: string): Promise<void> {
        return this.contract.functions.approveMint(owner).then(this.wait)
    }

    async approveRevoke(tokenId: number): Promise<void> {
        return this.contract.functions.approveRevoke(tokenId).then(this.wait)
    }

    // IERC4671Delegate
    async delegate(operator: string, owner: string): Promise<void> {
        return this.contract.functions.delegate(operator, owner).then(this.wait)
    }

    async delegateBatch(operators: string[], owners: string[]): Promise<void> {
        return this.contract.functions.delegateBatch(operators, owners).then(this.wait)
    }

    async mint(owner: string): Promise<void> {
        return this.contract.functions.mint(owner).then(this.wait)
    }

    async mintBatch(owners: string[]): Promise<void> {
        return this.contract.functions.mintBatch(owners).then(this.wait)
    }

    async issuerOf(tokenId: number): Promise<string> {
        return this.contract.functions.issuerOf(tokenId).then(this.first)
    }
}

export { ERC4671 }