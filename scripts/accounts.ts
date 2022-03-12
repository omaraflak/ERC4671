import * as dotenv from "dotenv"
import { ethers } from "ethers"
import { Utils } from "./utils"

dotenv.config()

const provider = new ethers.providers.WebSocketProvider(process.env.PROVIDER)
const account1 = new Utils(provider, process.env.PRIVATE_KEY_1)
const account2 = new Utils(provider, process.env.PRIVATE_KEY_2)
const disconnect = () => provider.destroy()

export { account1, account2, disconnect }