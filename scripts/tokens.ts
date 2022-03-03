import { getContract, wallet } from "./utils"

const addresses = [
    "0x4200c7ee62aebd20599235f615e1524F293640Bf"
]

addresses.forEach((address: string) => {
    const contract = getContract(address, "bin/ERC4671.abi")
    const promises = [
        contract.functions.name(),
        contract.functions.symbol(),
        contract.functions.balanceOf(wallet.address)
    ]
    Promise.all(promises).then(data => {
        const [name, symbol, balance] = data
        console.log(`${name}, ${symbol}, balance: ${parseInt(balance[0]._hex, 16)}`)
    })
})
