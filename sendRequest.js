function sendCrypt(url, request) {
    //var url = "";

    const newRequest new Request(url, {
        method: "POST",
        body:  request
    })

}

function verifyCrypt(url, request) {
    fetch(url, {
        method: "GET"
    })
}