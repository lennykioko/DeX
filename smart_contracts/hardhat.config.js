require('@nomiclabs/hardhat-waffle')

// module.exports = {
//   solidity: {
//     version: '0.8.13',
//   },
// }

module.exports = {
  // defaultNetwork: 'rinkeby',
  networks: {
    hardhat: {},
  },
  solidity: {
    version: '0.8.13',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 40000,
  },
}
