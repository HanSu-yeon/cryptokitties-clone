// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract LectureNFT is ERC721,Ownable{
    using Strings for uint256;

  //프로젝트이름, 심볼
  // constructor() ERC721("LectureNFT","LECTURE"){
  //   for(uint i=0; i<10; i++){
  //     _safeMint(msg.sender, i+1);
  //   }
  // }
  uint256 MAX_SUPPLAY = 100;
  bool isSaleActive;
  uint256 totalSupply;
  mapping(uint256 =>uint256) tokenMetadataNo;
  //상속받은 순서에 맞춰 초기화하는 것이 핵심
  constructor() ERC721("LectureNFT","LECTURE") Ownable(msg.sender) {}

  //token uri 바꾸기
  // function _baseURI() internal view virtual returns (string memory) {
  //       return "ipfs://[피나타에 메타데이터 폴더 업로드했을떄 나오는 해시값]";
  // }

  //아무나 호출할 수 없게! (ownable 컨트랙트 -> 컨트랙트 생성되는 시점에 컨트랙트 생성한 지갑을 오너로 지정)
  function setSale(bool active) external onlyOwner{
    isSaleActive = active;
  }

  function mintPlanet(uint256 count) external payable {
    require(isSaleActive, "not on sale");
    require(msg.value >= 1000000000000000*count); //0.001eth
    require(count <= 10, "mint maximum 10 nfts at once");
    
    for(uint i=0; i<count; i++){
      require(totalSupply<MAX_SUPPLAY, "max supply exceeded");
      tokenMetadataNo[totalSupply] = 1+(uint256(blockhash(block.number)) % 8);
      _safeMint(msg.sender, totalSupply++);
    }
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
      _requireOwned(tokenId);

      string memory baseURI = _baseURI();
      return string(abi.encodePacked(baseURI, tokenMetadataNo[tokenId].toString()));
  }

  function withdraw() external onlyOwner{
    payable(msg.sender).transfer(address(this).balance);
  }
  

}