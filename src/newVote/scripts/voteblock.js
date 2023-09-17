import * as zkp from '@cloudflare/zkp-ecdsa';

async function CreateVoteBlock(vote_id, vote_choice, block_id, previous_block_hash, user_key_pair, key_ring){
    const block = {
        vote_id: vote_id,
        vote_choice: vote_choice,
        block_id: block_id,
        previous_block_hash: previous_block_hash,
        public_key: btoa(JSON.stringify(window.crypto.subtle.exportKey("jwk", user_key_pair.publicKey))),
    };

    const block_json =  JSON.stringify(block, null, 2);
    const signature = await window.crypto.subtle.sign( {name: "ECDSA", hash: { name: "SHA-256" } }, user_key_pair.privateKey, new TextEncoder().encode(block_json));
    const params = zkp.generateParamsList();
    const block_hash = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(block_json));

    return {
        block: block,
        block_proof: await zkp.proveSignatureList(params, new Uint8Array(block_hash), new Uint8Array(signature), user_key_pair.publicKey, user_key_index, key_ring),
    };
}
