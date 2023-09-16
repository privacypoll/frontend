const bip39 = require('bip39')
function tryNewVote() {
    //get variables
    var votersID = document.getElementById("voteID");
    var votersVote = document.getElementById("candidateID");
    var submitButton = document.getElementById("voteCheckButton");

    onClickDisable(votersID, votersVote, submitButton);


}
//***********************************************
//this stuff is what you call dumb code
function onClickDisable(id,vote,submit) {
    id.disabled = true;
    vote.disabled = true;
    submit.disabled = true;
}