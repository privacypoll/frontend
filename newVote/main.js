document.getElementById("voteID").onclick = function(){
    let inputVoteID = document.getElementById("voteID")
    let inputCandidateID = document.getElementById("candidateID")
    let inputVoteText = inputVoteID.value;
    let inputCandidateText = inputCandidateID.value;

    inputVoteID.value = '';
    inputCandidateID.value = '';
};