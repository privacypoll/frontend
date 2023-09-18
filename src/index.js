import * as zkp from '@cloudflare/zkp-ecdsa';
import {bitLen} from "@cloudflare/zkp-ecdsa/lib/src/bignum/big";
const url = "http://tjroh01.workers.dev";

/*******************
       INDEX
*******************/

export async function nextSection() {
    //get variables
    const idText = document.getElementById("idText");
    const idButton = document.getElementById("idButton");

    //enable the radios
    document.getElementById("a").disabled = false;
    document.getElementById("b").disabled = false;
    document.getElementById("c").disabled = false;


};
window.nextSection = nextSection;

export async function voteSection() {
    //get variables
    const voteRadioA = document.getElementById("a");
    const voteRadioB = document.getElementById("b");
    const voteRadioC = document.getElementById("c");
    const voteButton = document.getElementById("voteButton");



}
window.voteSection = voteSection;

export function savePrivateKey(keyPair) {
    localStorage.setItem("keyPair", keyPair);
};
window.savePrivateKey = savePrivateKey;

export function onClickDisable(id,vote,submit) {
    id.disabled = true;
    vote.disabled = true;
    submit.disabled = true;
};
window.onClickDisable = onClickDisable;

/*******************
      HTTP PUT
*******************/

export async function putInitial() {
    const url = "https://put-initial.tjroh01.workers.dev";
    return fetch(url, {
        method: "POST",
        body: JSON.stringify({ voteOptions: ["a", "b", "c"]})
    }).then(res => {return res.json()})
        .catch(function(res){console.log(res)})
}
window.putInitial = putInitial;

export async function putIdentity(voteId, identityString){
    const url = "https://put-identity.tjroh01.workers.dev";
    
    // Generate the key pair
    const userKeyPair = await window.crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256"}, true, ["sign", "verify"])
    
    // For some reason it doesn't want to just cache the key pair so I have to cache them seperate
    window.localStorage.setItem("userPubKey", userKeyPair.publicKey);
    window.localStorage.setItem("userPrivKey", userKeyPair.privateKey);

    // Export the public key
    const exportedKey = btoa(JSON.stringify(await window.crypto.subtle.exportKey("jwk", userKeyPair.publicKey)));

    // Create and append the header
    const headers = new Headers();
    headers.append("vote-id", voteId.toString())

    // Send the request
    return fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({publicKey: exportedKey, identityString: identityString})
    }).then(function(res){console.log(res)})
        .catch(function(res){console.log(res)})
}
window.putIdentity = putIdentity;

export async function putBlock(voteId, vote, keyRing, lastBlockId){
    const url = "https://put-block.tjroh01.workers.dev";

    // Get the keys from cache
    //let userPubKey = localStorage.getItem("userPubKey");
    //let userPrivKey = localStorage.getItem("userPrivKey");
    //const exportedPubKey = btoa(JSON.stringify(await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)));

    // Create and append the header
    const headers = new Headers();
    headers.append("vote-id", voteId.toString())

    // Create the new block
    let newBlock = await CreateVoteBlock(voteId, vote, lastBlockId + 1, keyRing);

    // Send
    return fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newBlock),
    }).then(res => {return res.json()})
        .catch(function(res) {console.log(res)})
}
window.putBlock = putBlock;

/*******************
     HTTP GET
*******************/

export async function getInitial(id_0) {
    const url = "https://get-initial.tjroh01.workers.dev";
    return fetch(url, {
        method: "GET",
        headers: {
            "vote-id":   id_0
        }
    })
        .then(res => {return res.json()})
        .catch(function(res){ console.log(res) });
}
window.getInitial = getInitial;

export async function getBlock(voteId){
    const url = "https://get-block.tjroh01.workers.dev";
    let headers = new Headers();
    headers.append("vote-id", voteId.toString());

    return fetch(url, {
        method: "GET",
        headers: headers
    }).then(res => {return res.json()})
        .catch(function(res) {console.log(res.json())});
}
window.getBlock = getBlock;

export async function getKeyRing(voteId){
    const url = "https://get-keyring.tjroh01.workers.dev";
    let headers = new Headers();
    headers.append("vote-id", voteId.toString());

    return fetch(url, {
        method: "GET",
        headers: headers
    }).then(res => {return res.json()})
        .catch(function (res) {console.log(res.json())});
}
window.getKeyRing = getKeyRing;

/*******************
     VOTE BLOCK
*******************/

export async function CreateVoteBlock(voteId, vote, blockId, keyRing){
    const userPubKey = window.localStorage.getItem("userPubKey");
    const userPrivKey = window.localStorage.getItem("userPrivKey");
    console.log("entered CreateVoteBlock");

    console.log("User's public key: " + userPubKey);

    console.log("Changing to int...");
    let pubKeyInt = await zkp.keyToInt(userPubKey); // Turn the key to and int || THIS IS CAUSING AN ERROR FOR SOME REASON
    console.log("Public key as an int: " + pubKeyInt);

    console.log("Finding key...");
    let userKeyIndex = null;
    for(let i = 0; i < keyRing.length; i++){ // Loop through the key ring
        if(pubKeyInt === keyRing[i]){ // If the key matches,
            userKeyIndex = i; // Log the index of it
            break;
        }
    }
    if(userKeyIndex === null){ // If the key was not in the key ring
        console.log("Failed to find the key in the key ring");
        return null; // Return null to mark a fail
    }else{
        console.log("user key " + keyRing[userKeyIndex] + " found at " + userKeyIndex);
    }

    // Create a signature and ZKP of the Vote ID
    const idSignature = await window.crypto.subtle.sign( {name: "ECDSA", hash: { name: "SHA-256" } }, userPrivKey, new TextEncoder().encode(voteId.toString()));
    const idParams = zkp.generateParamsList();
    const idHash = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(voteId.toString()));
    const idProof = await zkp.proveSignatureList(idParams, new Uint8Array(idHash), new Uint8Array(idSignature), userPubKey, userKeyIndex, keyRing);

    // Create the block object
    const voteBlock = {
        blockId: blockId,
        vote: vote,
        idProof: idProof
    };

    // Now sign the block and create a ZKP of it
    const blockJson =  JSON.stringify(voteBlock, null, 2); // Create a string of the block
    const blockSig = await window.crypto.subtle.sign( {name: "ECDSA", hash: { name: "SHA-256" } }, userPrivKey, new TextEncoder().encode(blockJson));
    const blockParams = zkp.generateParamsList();
    const blockHash = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(blockJson));
    const blockProof = await zkp.proveSignatureList(blockParams, new Uint8Array(blockHash), new Uint8Array(blockSig), userPubKey, userKeyIndex, keyRing);

    // Return the block and its ZKP
    return {
        voteBlock: voteBlock,
        proof: blockProof,
    };
}
window.CreateVoteBlock = CreateVoteBlock;
