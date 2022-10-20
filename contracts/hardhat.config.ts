import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
          //changed
        '0x778073edd95d0b6f2cc331502f2c3a93c14b7591cebeddeebeb6ab4fe8c6ccbf', //index0
        '0x9dd30c9c1e92406b50bd2d86c5be52edfe79da4a7624934cc6a1c4644d30b28b', //index1
        '0x077def2e918a480d6a7923b5b42213272e7ad92828c5de4aa419dde347eaef2f', //index2
        '0x6a9ff419731502eb4db7b61cd8807c2498b6b1dd7d0712173933d43f8872283e', //index3
        '0x4fcb30464ad545bb1568a4595a3dc0301f1406079ab3467b344367366a3a944f'  //index4
      ]
    },
  },
};

export default config;
