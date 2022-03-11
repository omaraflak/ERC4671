import * as fs from "fs"
import * as dotenv from "dotenv"
import { ethers } from "ethers"

dotenv.config()

class Utils {
    wallet: ethers.Wallet

    constructor(provider: string, privateKey: string) {
        const ws = new ethers.providers.WebSocketProvider(provider)
        this.wallet = new ethers.Wallet(privateKey, ws)
    }

    getContractFactory = (abi: string, bin: string) => {
        const contractABI = JSON.parse(fs.readFileSync(abi).toString())
        const contractBin = "0x" + fs.readFileSync(bin).toString()
        return new ethers.ContractFactory(contractABI, contractBin, this.wallet)
    }

    getContract = (address: string, abi: string) => {
        const contractABI = JSON.parse(fs.readFileSync(abi).toString())
        return new ethers.Contract(address, contractABI, this.wallet)
    }
}

const utilsForWallet1 = new Utils(process.env.PROVIDER, process.env.PRIVATE_KEY_1)
const utilsForWallet2 = new Utils(process.env.PROVIDER, process.env.PRIVATE_KEY_2)

export { Utils, utilsForWallet1, utilsForWallet2 }
