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
    const keyPair = await window.crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256",}, true, ["sign", "verify"])
    const pubKey = btoa(JSON.stringify(await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)));
    const headers = new Headers();
    headers.append("vote-id", voteId.toString())

    console.log(JSON.parse(JSON.stringify({publicKey: pubKey, identityString: identityString})))
    return fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({publicKey: pubKey, identityString: identityString})
    }).then(function(res){console.log(res)})
        .catch(function(res) {console.log(res)})
}
window.putIdentity = putIdentity;

export async function putBlock(voteId, vote, keyPair, keyRing, lastBlockId){
    const url = "https://put-block.tjroh01.workers.dev";
    //const pubKey = btoa(JSON.stringify(await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)));
    const headers = new Headers();
    headers.append("vote-id", voteId.toString())

    console.log(keyRing.keyring);

    let newBlock = await CreateVoteBlock(voteId, vote, lastBlockId + 1, keyPair, keyRing);

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

export async function CreateVoteBlock(voteId, vote, blockId, userKeyPair, keyRing){

    let userKeyIndex;

    for(let i = 1; i < keyRing.length; i++){ // Check for the key in the ring
        if(userKeyPair.publicKey === keyRing[i]){
            userKeyIndex = i;
            break;
        }
    }

    console.log("user key " + keyRing[userKeyIndex] + " found at " + userKeyIndex);

    const idSignature = await window.crypto.subtle.sign( {name: "ECDSA", hash: { name: "SHA-256" } }, userKeyPair.privateKey, new TextEncoder().encode(voteId.toString()));
    const idParams = zkp.generateParamsList();
    const idHash = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(voteId.toString()));
    const idProof = await zkp.proveSignatureList(idParams, new Uint8Array(idHash), new Uint8Array(idSignature), userKeyPair.publicKey, userKeyIndex, keyRing);

    const voteBlock = {
        blockId: blockId,
        vote: vote,
        idProof: idProof
    };

    const blockJson =  JSON.stringify(voteBlock, null, 2); // Create a string of the block
    const blockSig = await window.crypto.subtle.sign( {name: "ECDSA", hash: { name: "SHA-256" } }, userKeyPair.privateKey, new TextEncoder().encode(blockJson));
    const blockParams = zkp.generateParamsList();
    const blockHash = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(blockJson));
    const blockProof = await zkp.proveSignatureList(blockParams, new Uint8Array(blockHash), new Uint8Array(blockSig), userKeyPair.publicKey, userKeyIndex, keyRing);

    return {
        voteBlock: voteBlock,
        proof: blockProof,
    };
}
window.CreateVoteBlock = CreateVoteBlock;
