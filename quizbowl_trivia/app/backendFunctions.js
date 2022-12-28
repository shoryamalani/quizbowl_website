

export const createAccount = async ()=> {
    await fetch("https://quizbowl.shoryamalani.com/createAccount", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(result => {
        result["token"];
    }).catch(error => {
        console.log(error);
    })
}

export function sendUsername(username ,userToken) {
    fetch("https://quizbowl.shoryamalani.com/username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                "username": username,
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


export function sendSignInRequest(userToken) {
    // console.log("sendSignInRequest");
    fetch("https://quizbowl.shoryamalani.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "token": userToken,
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
}
