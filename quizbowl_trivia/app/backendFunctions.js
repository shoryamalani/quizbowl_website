

function createAccount() {
    fetch("https://quizbowl.shoryamalani.com/createAccount", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        return result;
    })
}

function sendUsername(username,userId ,userToken) {
    fetch("https://quizbowl.shoryamalani.com/username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                "username": username,
                "userId": userId,
                "token": userToken,
            }
        )
    })
    .then(response => response.json())
    .then(result => {
        return {"success": "Username accepted"}
    }).catch(error => {
        return {"error": "Username not accepted"};
    })
}


function sendSignInRequest(userToken,userId) {
    // console.log("sendSignInRequest");
    fetch("https://quizbowl.shoryamalani.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "token": userToken,
            "userId": userId,
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
}
