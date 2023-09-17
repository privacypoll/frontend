async function putInitial() {
    const url = "https://put-initial.tjroh01.workers.dev";
    return fetch(url, {
        method: "POST",
        body: JSON.stringify({ voteOptions: ["a", "b", "c"]})
    }).then(res => {return res.json()})
        .catch(function(res){console.log(res)})
}

async function putIdentity(voteId, identityString){
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

async function getInitial(id_0) {
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

async function getBlock(voteId){
    const url = "https://get-block.tjroh01.workers.dev";
    let headers = new Headers();
    headers.append("vote-id", voteId.toString());

    return fetch(url, {
        method: "GET",
        headers: headers
    }).then(res => {return res.json()})
        .catch(function(res) {console.log(res.json())});
}

async function getKeyRing(voteId){
    const url = "https://get-keyring.tjroh01.workers.dev";
    let headers = new Headers();
    headers.append("vote-id", voteId.toString());

    return fetch(url, {
        method: "GET",
        headers: headers
    }).then(res => {return res.json()})
        .catch(function (res) {console.log(res.json())});
}