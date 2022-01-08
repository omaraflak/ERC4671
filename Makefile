all:
	solc @openzeppelin/=./node_modules/@openzeppelin/ --bin --abi --overwrite ./contracts/*.sol -o ./bin