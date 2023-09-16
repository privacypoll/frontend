function GetEncodedString(input){
    let enc = new TextEncoder();
    return enc.encode(input);
}
async function CreateVoteBlock(vote_id, vote_choice, block_id, key_pair){
    const block = {
        vote_id: vote_id,
        timestamp: new Date().getDate(),
        vote_choice: vote_choice,
        block_id: block_id,
        public_key: key_pair.publicKey
    };

    const block_json =  JSON.stringify(block, null, 2);
    const signature = await window.crypto.subtle.sign( {name: "ECDSA", hash: { name: "SHA-256" } }, key_pair.privateKey, GetEncodedString(block_json));

    return {
        block: block,
        signature: signature,
    };
}

//key_pair = await window.crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256"}, true, ["sign", "verify"]);
//vote_block = CreateVoteBlock(12, 1, 1, key_pair);
//console.log(vote_block);