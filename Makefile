all: build docs

build:
	solc @openzeppelin/=./node_modules/@openzeppelin/ --bin --abi --overwrite ./contracts/*.sol -o ./bin

docs:
	npm run docs