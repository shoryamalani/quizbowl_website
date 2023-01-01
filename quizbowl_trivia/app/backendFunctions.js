import constants from './config/constants';
export function sendUsername(username ,userToken) {
    fetch(constants.apiUrl+"/username", {
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
    fetch(constants.apiUrl+"/login", {
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
