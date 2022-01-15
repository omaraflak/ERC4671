import { contractFactory } from "./utils"

contractFactory.deploy().then(contract => {
    console.log("tx hash:", contract.deployTransaction.hash)
    contract.deployed().then(deployed_contract => {
        console.log("contract:", deployed_contract.address)
    })
}).catch(console.error)