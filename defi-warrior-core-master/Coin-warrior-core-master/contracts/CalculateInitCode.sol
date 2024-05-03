pragma solidity =0.5.16;
import './CoinWarriorPair.sol';

contract CalculateInitCode {
    function getInitHash() public pure returns(bytes32){
        bytes memory bytecode = type(CoinWarriorPair).creationCode;
        return keccak256(abi.encodePacked(bytecode));
    }
}