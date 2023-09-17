const url = "http://tjroh01.workers.dev";
async function tryNewVote() {
    //get variables
    var votersID = document.getElementById("voteID");
    var votersVote = document.getElementById("candidateID");
    var submitButton = document.getElementById("voteCheckButton");
    var wordsGenerated =document.getElementById("keyCode");

    onClickDisable(votersID, votersVote, submitButton);

    localStorage.setItem("votersVote",votersVote);
    var newKeyPair = generateKeyPair()
};

function onClickDisable(id,vote,submit) {
    id.disabled = true;
    vote.disabled = true;
    submit.disabled = true;
};