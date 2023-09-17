<<<<<<< HEAD
//import * as zkp from '@cloudflare/zkp-ecdsa';

=======
async function generateKeyPair() {
    var keyPair = await window.crypto.subtle.generateKey({
        name: "ECDSA",
        namedCurve: "P-256"
    }, true, ["sign", "verify"]);
    return (keyPair);
};
>>>>>>> 4be520970cba7ea1c670e1264efce48eb794d08d
function GetEncodedString(input){
    let enc = new TextEncoder();
    return enc.encode(input);
}
async function CreateVoteBlock(vote_id, vote_choice, block_id, user_key_pair, key_ring, user_key_index){
    const block = {
        vote_id: vote_id,
        timestamp: new Date().getDate(),
        vote_choice: vote_choice,
        block_id: block_id,
        public_key: user_key_pair.publicKey
    };

    const block_json =  JSON.stringify(block, null, 2);
    const signature = await window.crypto.subtle.sign( {name: "ECDSA", hash: { name: "SHA-256" } }, user_key_pair.privateKey, GetEncodedString(block_json));
    const params = zkp.generateParamsList();
    const block_hash = await window.crypto.subtle.digest("SHA-256", GetEncodedString(block_json));

    return {
        block: block,
        block_proof: await zkp.proveSignatureList(params, block_hash, signature, user_key_pair.publicKey, user_key_index, key_ring),
    };
}