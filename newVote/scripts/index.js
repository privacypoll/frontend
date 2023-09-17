const url = "http://tjroh01.workers.dev";
async function tryNewVote() {
    //get variables
    var votersID = document.getElementById("voteID");
    var votersVote = document.getElementById("candidateID");
    var submitButton = document.getElementById("voteCheckButton");
    var wordsGenerated =document.getElementById("keyCode");

    onClickDisable(votersID, votersVote, submitButton);

    //var keypair = generateKeyPair()
    //wordsGenerated.innerText = CreateVoteBlock(votersID.value, votersVote.value, block_id, keypair);
};
//***********************************************
//this stuff is what you call dumb code

function onClickDisable(id,vote,submit) {
    id.disabled = true;
    vote.disabled = true;
    submit.disabled = true;
};

/*
function generateKeyPair() {
    var key_pair = await window.crypto.subtle.generateKey({
        name: "ECDSA",
        namedCurve: "P-256"
    }, true, ["sign", "verify"]);
    return (key_pair);
};
*/