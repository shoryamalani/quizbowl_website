function searchClue(){
    // What is search
    var search = document.getElementById("clueSearch").value;
    // make get request to server
 // create a JSON object

  
  // request options
   var options = {
    method: 'POST',
    body: JSON.stringify({"search": search}),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  
  // send post request
  fetch('/search_clue', options)
    .then(res => res.json())
    .then(res => setAnswer(res))
    .catch(err => console.error(err))


}
function setAnswer(res){
    document.getElementById("answer").innerHTML = res;
}