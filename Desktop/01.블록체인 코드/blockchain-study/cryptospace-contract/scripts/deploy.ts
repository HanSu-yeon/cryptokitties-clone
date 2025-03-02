import { ethers } from 'hardhat';

async function main() {
  const Planet = await ethers.getContractFactory('Planet');
  const contract = await Planet.deploy(10000);

  // await contract.deployed();

  console.log('NFT contract: ', await contract.getAddress());
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
