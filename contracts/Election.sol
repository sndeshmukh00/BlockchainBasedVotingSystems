pragma solidity ^0.5.16;

contract Election{
    //Model a candidate

    // address public admin;
    // uint public startTime;
    // uint public endTime;

    struct Candidate{
        uint id; //uint = unsigned integer
        string name;
        uint voteCount;
    }

    //store accounts that have voted
    mapping(address => bool) public voters;

    //Store candidates
    //fetch candidates
    mapping(uint => Candidate) public candidates;
    // store candidate count
    uint public candidatesCount;

    //constructor  -->
    constructor() public{
        // admin = msg.sender;
        // startTime = now;
        // endTime = startTime + 5 minutes;
        addCandidate("Jerry");
        addCandidate("Shinchan");
        addCandidate("Tom");
    }

    function addCandidate (string memory _name) private{
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        //require that they haven't voted before
        require(!voters[msg.sender]);

        //require a valid candidate
        require( _candidateId > 0 && _candidateId <= candidatesCount );


        //record that voter has voted
        voters[msg.sender] = true;

        //update candidate vote count
        candidates[_candidateId].voteCount ++;
    }

    

}
