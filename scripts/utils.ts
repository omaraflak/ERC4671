import * as fs from "fs"
import * as dotenv from "dotenv"
import { ethers } from "ethers"

dotenv.config()

const provider = new ethers.providers.WebSocketProvider(process.env.PROVIDER)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const contractABI = JSON.parse(fs.readFileSync("bin/EIPCreatorBadge.abi").toString())
const contractBin = "0x" + fs.readFileSync("bin/EIPCreatorBadge.bin").toString()

const contractFactory = new ethers.ContractFactory(contractABI, contractBin, wallet)
const getContract = (address: string) => new ethers.Contract(address, contractABI, wallet)

export { provider, wallet, contractFactory, getContract }
