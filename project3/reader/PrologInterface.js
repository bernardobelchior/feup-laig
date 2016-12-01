function getPrologRequest(requestString, onSuccess, onError, port) {
    let requestPort = port || 8081;
    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess || function (data) {
            console.log("Request successful. Reply: " + data.target.response);
        };
    request.onerror = onError || function () {
            console.log("Error waiting for response");
        };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(onload) {
    // Get Parameter Values
    let requestString = document.querySelector("#query_field").value;

    // Make Request
    let reply = onload || handleReply;
    getPrologRequest(requestString, reply);
}

//Handle the Reply
function handleReply(data) {
    console.log(data);
}