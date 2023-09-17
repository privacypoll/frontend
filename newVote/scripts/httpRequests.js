async function putInitial(id_0) {
    const url = "http://get-initial.tjroh01.workers.dev";
    fetch(url);

};

async function getInitial(id_0,id_1) {
    const url = "http://get-initial.tjroh01.workers.dev";
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            "voteId": id_0
        }),
        headers: {
            "vote-id":   id_1
        }
    })
        .then(function (res){ console.log(res)})
        .catch(function(res){ console.log(res) });
};