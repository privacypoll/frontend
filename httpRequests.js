async function postInitial() {
    var url = "http://tjroh01.workers.dev"
    const response = await fetch()
};

async function getInitial(voterID) {
    const url = "http://get-initial.tjroh01.workers.dev";
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            "voteId": voterID
        }),
        headers: {
            "vote.id":
        }
    })
        .then(function (res){ console.log(res)})
        .catch(function(res){ console.log(res) });
};

async function postParallel(information) {
    const responses = await Promise.all(
        information.map(async id => {
            const res = await fetch(url, {
                method: "POST",

                body: JSON.stringify({
                    "voteId": information
                })
            });
        })
    );
};