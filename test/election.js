 var Election = artifacts.require("./Election.sol");

 contract("Election", function(accounts){
     var electionInstance;

    it("intializes with two candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count) {
            assert.equal(count, 2);
        });
    });

    it("it initializes the candidates with the correct values", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0], 1, "Contains the correct id");
            assert.equal(candidate[1], "Modi Ji", "Contains the correct name");
            assert.equal(candidate[2], 0, "Contains the correct Vote count");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0], 2, "Contains the correct id");
            assert.equal(candidate[1], "Pappu", "Contains the correct name");
            assert.equal(candidate[2], 0, "Contains the correct Vote count");
        });
    });

 });