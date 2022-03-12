import * as dotenv from "dotenv"
import { Utils } from "./utils"

dotenv.config()

const account1 = new Utils(process.env.PROVIDER, process.env.PRIVATE_KEY_1)
const account2 = new Utils(process.env.PROVIDER, process.env.PRIVATE_KEY_2)

export { account1, account2 }