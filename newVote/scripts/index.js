const url = "http://tjroh01.workers.dev";

async function tryNewVote() {
    //get variables
    const votersID = document.getElementById("voteID");
    const votersVote = document.getElementById("candidateID");
    const submitButton = document.getElementById("voteCheckButton");
    const wordsGenerated =document.getElementById("keyCode");

    onClickDisable(votersID, votersVote, submitButton);
    const newKeyPair = generateKeyPair()

    savePrivateKey(generateKeyPair())
};
function savePrivateKey(keyPair) {
    localStorage.setItem("keyPair", keyPair);
};

function onClickDisable(id,vote,submit) {
    id.disabled = true;
    vote.disabled = true;
    submit.disabled = true;
};