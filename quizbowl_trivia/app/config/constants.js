let constants;
if(__DEV__) {
    constants = {
        "apiUrl": "http://192.168.15.237:3001",
    }
}else{
    constants = {
        "apiUrl": "https://quizbowl.shoryamalani.com",
    }

}

export default constants;