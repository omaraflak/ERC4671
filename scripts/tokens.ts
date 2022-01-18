import { getContract, wallet } from "./utils"

const addresses = [
    "0x8cBeB62310abE44Adc1e76Da6276bC3fC707C1Cd"
]

addresses.forEach((address: string) => {
    const contract = getContract(address, "bin/NTT.abi")
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
