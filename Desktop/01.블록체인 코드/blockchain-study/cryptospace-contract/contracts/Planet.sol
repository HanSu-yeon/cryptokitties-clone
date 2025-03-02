// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//Planet계약은 ERC721을 상속받아 NFT 기능을 구현함
//Ownable을 상속받아 계약 소유자만 호출할 수 있는 함수(onlyOwner제어자 사용)를 구현한다
contract Planet is ERC721, Ownable{
  using Strings for uint256;

  uint256 numOfMetadata; //메타데이터 총 개수, 민팅 시 랜덤한 메타데이터 ID를 생성하는 데 사용됨
  uint256 public totalSupply; //총 NFT 발행량 저장
  mapping(uint256 => uint256) tokenMetadataId; //각 토큰 ID에 고유한 메타데이터 ID를 매핑하여 저장함

  constructor(uint256 numOfMetadata_) ERC721("CryptoSpace","PLANET") Ownable(msg.sender){
    numOfMetadata = numOfMetadata_;
  }

  //민팅 함수
  function mintPlanet() external payable{
    require(msg.value >=0.01 ether); //가격조건:호출자가 0.01 ETH 이상을 송금해야 민팅이 가능함
    uint256 tokenId = totalSupply++; //토큰ID: 현재 값 사용해 새 토큰ID 설정하고 민팅 후 총 발행량 1 증가

    //메타데이터 ID 할당: blockhash를 사용해 메타데이터id를 랜덤하게 생성함.
    //이 metadataId는 numOfMetadata로 나눈 나머지 값을 가지며, 이는 전체 메타데이터 개수 범위 내에서 생성됨
    uint256 metadataId = uint256(blockhash(block.number-1)) % numOfMetadata;

    tokenMetadataId[tokenId] = metadataId;
    //_safeMint함수 호출하여 발행된 NFT가 호출자에게 안전하게 전송됨
    _safeMint(_msgSender(), tokenId);
  }
  
  //토큰 URI
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId); //토큰 소유자 확인
        //baseURI와 tokenMetadataId의 문자열을 연결하여 고유한 메타데이터 url을 반환함
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenMetadataId[tokenId].toString()) : "";
    }

    //기본 URI
    function _baseURI() internal view virtual override returns (string memory) {
        return "https://space.coinyou.io/metadata/";
    }
  //잔액 인출
  function withdraw() external onlyOwner{
    payable(msg.sender).transfer(address(this).balance);
  }

}