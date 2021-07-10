App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function(){
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function(){
    $.getJSON("Election.json", function(election){
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      
      return App.render(); 
    });
  },

  render: function(){
    var electionInstance;
    var loader = $('#loader');
    var content = $('#content');
    var voteContent = $('#voteContent');
    var voteCasted = $('#voteCasted');

    loader.show();
    content.hide();
    voteContent.hide();

    web3.eth.getCoinbase(function(err, account){
      if(err === null){
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Election.deployed().then(function(instance){
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount){
      var candidatesResult = $("#candidatesResults");
      candidatesResult.empty();


      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      var candidateWon = $('#candidateWon');
      candidateWon.empty();


      for(var i = 1; i <= candidatesCount; i++){
        electionInstance.candidates(i).then(function(candidates){
          var id = candidates[0];
          var name = candidates[1];
          var voteCount = candidates[2];
          

          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          candidatesResult.append(candidateTemplate);

          

          var candidateOption = "<option value='" + id + "' >" + name + "</option>";
          candidatesSelect.append(candidateOption);

        });
      }
      
      

      return electionInstance.voters(App.account);
    }).then(function(hasVoted){
      if(hasVoted){
        $('form').hide();
        showCountDown();
        // content.show();
        voteCasted.show();
        
      }
      loader.hide();
      // content.show();
      voteContent.show();
      
    }).catch(function(error){
      console.warn(error);
    });



  },

  castVote: function(){
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance){
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result){
      $('#content').hide();
      $('#voteContent').hide();
      $('#loader').show();
      
      location.reload();
    }).catch(function(err){
      console.error(err);
    });
  }


};

function showCountDown(endTime) {
  var now = new Date().getTime();
  console.log(now);
  var timed = now + 30000;
  var temp = new Date(timed);
  // console.log(temp);
  var dateee = temp.toLocaleTimeString();
  console.log(dateee);
  var countDownDate = new Date(endTime * 1000);
  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    while(timed>now){
      $('#countDown').text('Election will end at ' + dateee);
      now = new Date().getTime;
    }
    if(now> timed){
      $('#voteCasted').hide();
      $('#content').show();
      $('#countDown').hide();
      $('#accountAddress').hide();
      // location.reload();
    }

    if (distance < 0) {
      clearInterval(x);
      $('#countDown').text('Time is up');
      content.show();
      location.reload();
    }
  }, 1000);
}


$(function() {
  $(window).load(function() {
    App.init();
  });
});
