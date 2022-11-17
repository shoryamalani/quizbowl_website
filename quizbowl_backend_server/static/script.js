function searchClue(){
    // What is search
    var search = document.getElementById("clueSearch").value;
    // make get request to server
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // do something with response
            var response = JSON.parse(this.responseText);
            console.log(response);
        }
    }
    xhttp.open("GET", "/search_clue", true);
    xhttp.send(search);
    

}