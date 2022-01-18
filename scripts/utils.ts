import * as fs from "fs"
import * as dotenv from "dotenv"
import { ethers } from "ethers"

dotenv.config()

const provider = new ethers.providers.WebSocketProvider(process.env.PROVIDER)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const getContractFactory = (abi: string, bin: string) => {
    const contractABI = JSON.parse(fs.readFileSync(abi).toString())
    const contractBin = "0x" + fs.readFileSync(bin).toString()
    return new ethers.ContractFactory(contractABI, contractBin, wallet)
}

const getContract = (address: string, abi: string) => {
    const contractABI = JSON.parse(fs.readFileSync(abi).toString())
    return new ethers.Contract(address, contractABI, wallet)
}

export { provider, wallet, getContractFactory, getContract }
