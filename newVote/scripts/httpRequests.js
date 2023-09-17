async function putInitial(id_0) {
    const url = "http://get-initial.tjroh01.workers.dev";
    fetch(url);

};

async function getInitial(id_0) {
    const url = "http://get-initial.tjroh01.workers.dev";
    fetch(url, {
        method: "GET",
        headers: {
            "vote-id":   id_0
        }
    })
        .then(function (res){ console.log(res)})
        .catch(function(res){ console.log(res) });
};