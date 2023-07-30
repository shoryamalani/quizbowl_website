let constants;
if(__DEV__) {
    constants = {
        // "apiUrl": "http://192.168.15.237:3001",
        // "apiUrl": "http://10.1.72.179:3001",
        "apiUrl": "https://quizbowl.shoryamalani.com",
    }
}else{
    constants = {
        "apiUrl": "https://quizbowl.shoryamalani.com",
    }

}

export default constants;