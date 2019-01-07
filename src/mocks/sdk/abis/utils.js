const fs = require('fs');
const contractPath = process.env.CONTRACT_PATH;
const path = `${contractPath}/build/addresses.json`;
const addresses = JSON.parse(fs.readFileSync(path));

export function mockAbi(contract) {
  const abi = require(`nahmii-sdk/lib/abis/${contract}`);//eslint-disable-line
  abi.networks[3] = {
    address: addresses.networks['ganache-cli'][contract],
  };
  return abi;
}
