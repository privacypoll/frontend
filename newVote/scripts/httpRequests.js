async function putInitial() {
    const url = "https://put-initial.tjroh01.workers.dev";
    fetch(url, {
        method: "POST",
        body: JSON.stringify({voteOptions: ["a","b","c"]})
    }).then(data => {return(data)})
        .catch(error => {console.error(error)})
};

async function getInitial(id_0) {
    const url = "https://get-initial.tjroh01.workers.dev";
    fetch(url, {
        method: "GET",
        headers: {
            "vote-id":   id_0
        }
    })
        .then(function (res){ console.log(res)})
        .catch(function(res){ console.log(res) });
};