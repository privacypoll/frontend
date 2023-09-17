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

    return fetch(url, {
        method: "POST",
        headers: { "vote-id": voteId },
        body: {publicKey: pubKey, identityString: identityString}
    }).then(res => {return res.json()})
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