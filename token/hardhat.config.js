require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    paths: {
      sources: './contracts',
      tests: './test',
      cache: './cache',
      artifacts: './artifacts',
    },
    // Menambahkan aturan exclude untuk mengabaikan file yang memicu masalah
    exclude: ['node_modules/@openzeppelin/contracts/certora/harnesses/AccessControlDefaultAdminRulesHarness.sol'],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: 'http://localhost:8545',
    },
  },
};
