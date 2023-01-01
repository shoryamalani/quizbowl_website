let constants;
if(__DEV__) {
    constants = {
        "apiUrl": "http://192.168.1.222:3001",
    }
}else{
    constants = {
        "apiUrl": "https://quizbowl.shoryamalani.com",
    }

}

export default constants;