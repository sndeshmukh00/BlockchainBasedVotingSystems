pragma solidity ^0.5.16;
contract Election{
    //Model a candidate
    struct Candidate{
        uint id; //uint = unsigned integer
        string name;
        uint voteCount;
    }

    //Store candidates
    //fetch candidates
    mapping(uint => Candidate) public candidates;
    // store candidate count
    uint public candidatesCount;

    //constructor  -->
    constructor() public{
        addCandidate("Modi Ji");
        addCandidate("Pappu");
    }

    function addCandidate (string memory _name) private{
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}
