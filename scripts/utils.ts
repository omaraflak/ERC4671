import * as fs from "fs"
import { ethers } from "ethers"

class Utils {
    wallet: ethers.Wallet

    constructor(provider: string, privateKey: string) {
        const ws = new ethers.providers.WebSocketProvider(provider)
        this.wallet = new ethers.Wallet(privateKey, ws)
    }

    getABI(abi: string) {
        return JSON.parse(fs.readFileSync(abi).toString())
    }

    getBIN(bin: string) {
        return "0x" + fs.readFileSync(bin).toString()
    }

    getContractFactory(abi: string, bin: string) {
        return new ethers.ContractFactory(this.getABI(abi), this.getBIN(bin), this.wallet)
    }

    getContract(address: string, abi: string) {
        return new ethers.Contract(address, this.getABI(abi), this.wallet)
    }
}

export { Utils }
