//
//  ContentView.swift
//  Shared
//
//  Created by Shorya and Arnav on 6/19/21.
//
//NOTE FOR SHORYA: we need to figure out how to write the tossup word by word
import SwiftUI

struct ContentView: View {
    @State private var answerFromUser: String = ""
    @State private var points: Int = 0
    //I don't think we need the variable correctLastQuestion as of now, but I'm just keeping it in case we might need it later
    @State private var correctLastQuestion:String = ""
    @State private var correctThisQuestion:String = ""
    @State private var totalQuestionsCorrect: Int = 0
    @State private var totalNegatives: Int = 0
    @State private var tryAgainOrCorrect:Color = Color.white
    @State private var full_question:[String] = [""]
    @State private var question_shown:String = ""
    @State private var answer:String = ""
    @State private var wordsShown:Int = 0
    @State private var buzzTime:Int = 0
    @State private var buzzed:Bool = false
    @State private var buzzOrSubmit:String = "Buzz"
    @State private var showAnswerBox: Bool = false
    func submitAnswerAndGetNewQuestion() {
        guard(buzzed) else { // this changes the buzz to submit answer
            buzzOrSubmit = "Submit Answer"
            showAnswerBox = true
            buzzed = true
            return
        }
        guard (answerFromUser != "") else { // makes sure the answer isnt blank
            return
        }
        if (answerFromUser.lowercased() == answer.lowercased()){
            correctLastQuestion = "correct"
            loadData()
            correctThisQuestion = "correct"
            tryAgainOrCorrect = Color.green
            totalQuestionsCorrect += 1
            points+=10
            buzzed = false
            showAnswerBox = false
            buzzOrSubmit = "Buzz" // resets the text to buzz
            
        }else{
            correctThisQuestion = "try again"
            tryAgainOrCorrect = Color.red
            totalNegatives += 1
            points-=5
            buzzed = false
            buzzOrSubmit = "Buzz" // resets the text to buzz
        }
        answerFromUser = ""
        buzzTime = 0 // reset buzz timer
        
    }
    func resetScore() {
        points = 0
        totalNegatives = 0
        totalQuestionsCorrect = 0
        correctLastQuestion = ""
        correctThisQuestion = ""
        tryAgainOrCorrect = Color.blue
    }
    func loadData() {
        guard let url = URL(string: "https://quizbowl.shoryamalani.com/get_question") else {
            print("Invalid URL")
            return
        }
           let request = URLRequest(url: url)
        URLSession.shared.dataTask(with: request) { data, response, error in
            
            if let data = data {
                                if let decodedResponse = try? JSONDecoder().decode(Result.self, from: data) {
                    // we have good data – go back to the main thread
                    print("here")
                    DispatchQueue.main.async {
                        // update our UI
                        full_question = decodedResponse.question // this is the question in a list
                        print(full_question)
                        question_shown = decodedResponse.question[0] // this is what people see on screen
                        answer = decodedResponse.answer // this is the whole answer NEEDS CHANGING LATER
                        wordsShown = 1
                        buzzed = false
                        Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true){ timer in
                            if(!buzzed){
                                if(!(wordsShown > (full_question.count - 1))){
                                    question_shown = question_shown + " " + full_question[wordsShown]
                                    wordsShown+=1
                                }
                            }else{
                                if (buzzTime > 40){ // This is how much time you have as you have buzzed
                                    points = points - 5 // if you buzz for longer than the 10 seconds you lose 5 points
                                    buzzed = false
                                }
                                buzzTime+=1
                            }
                            if wordsShown == full_question.count {
                                timer.invalidate()
                                
                            }
                            
                        }

                    }
                                    

                    // everything is good, so we can exit
                    return
                }
            }

            // if we're still here it means there was a problem
            print("Fetch failed: \(error?.localizedDescription ?? "Unknown error")")
        }.resume()
    }
    var body: some View {
        VStack() {
            
            Text("Points:\(String(points))").font(.headline).padding(.vertical, 20.0).padding(.horizontal).background(Color.yellow)
            Spacer()
            VStack() {
                
                
                Text("Stats for this session: \(totalQuestionsCorrect) questions correct and \(totalNegatives) incorrect attempts").padding().background(Color.orange)
                Text(String(question_shown)) // This is where the question is shown
                    .font(.headline)
                    .foregroundColor(Color.white)
                    .padding()
                    .background(Color.black)
                Text("This Question: \(correctThisQuestion)").font(.headline).padding(.horizontal).padding(.vertical, 20.0).background(tryAgainOrCorrect).opacity(0.8) // This is where it shows if the question is right NEEDS CHANGING
            }.onAppear(perform: loadData)
            // So this is the text box underneath and the reason it has the opacity show box answer is to hide it when it shouldnt be shown
            // On the other hand onCommit is when you hit enter
            TextField("Write answer here", text: $answerFromUser,onCommit:{
                submitAnswerAndGetNewQuestion()
            }).padding().border(Color.gray, width: 2).cornerRadius(3.0).opacity(showAnswerBox ? 1 : 0)
            Button(action: submitAnswerAndGetNewQuestion) {
                Text(buzzOrSubmit).padding()
            }
            // the buzzOrSubmit is just changing from Buzz to Submit answer based on what needs to be shown
            Button(action: loadData) {
                Text("Get New question").padding()
            } // gets a new question
            Button(action: resetScore){
                Text("Reset Score").padding()
            } // Resets Score NEEDS CHANGING
            
            Spacer()
        }
    }
}
struct Result: Codable {
    var questionId: Int
    var question: [String]
    var answer: String
}


struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
