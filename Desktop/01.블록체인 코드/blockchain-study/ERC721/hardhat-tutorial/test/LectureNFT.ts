import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Signer } from 'ethers';

describe('LectureNFT', function () {
  let owner: Signer;
  before(async () => {
    [owner] = await ethers.getSigners();
  });

  it('should have 10 nfts', async () => {
    const LectureNFT = await ethers.getContractFactory('LectureNFT');
    const contract = await LectureNFT.deploy();

    expect(await contract.balanceOf(await owner.getAddress())).to.be.equal(9);
  });
});
