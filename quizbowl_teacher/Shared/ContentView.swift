//
//  ContentView.swift
//  Shared
//
//  Created by Shorya and Arnav on 6/19/21.
//
//NOTE FOR SHORYA: we need to figure out how to write the tossup word by word
import SwiftUI

struct ContentView: View {
    @State private var results = ["","",""]
    @State private var answerFromUser: String = ""
    @State private var points: Int = 0
    //I don't think we need the variable correctLastQuestion as of now, but I'm just keeping it in case we might need it later
    @State private var correctLastQuestion:String = ""
    @State private var correctThisQuestion:String = ""
    @State private var totalQuestionsCorrect: Int = 0
    @State private var totalNegatives: Int = 0
    @State private var tryAgainOrCorrect:Color = Color.white
    func submitAnswerAndGetNewQuestion() {
        guard (answerFromUser != "") else {
            return
        }
        if (answerFromUser.lowercased() == results[2].lowercased()){
            correctLastQuestion = "correct"
            loadData()
            correctThisQuestion = "correct"
            tryAgainOrCorrect = Color.green
            totalQuestionsCorrect += 1
            points+=10
        }else{
            correctThisQuestion = "try again"
            tryAgainOrCorrect = Color.red
            totalNegatives += 1
            points-=5
                
        }
        answerFromUser = ""
        
        
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
                        self.results = [decodedResponse.question,decodedResponse.question,decodedResponse.answer]
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
                Text(String(results[1]))
                    .font(.headline)
                    .foregroundColor(Color.white)
                    .padding()
                    .background(Color.black)
                Text("This Question: \(correctThisQuestion)").font(.headline).padding(.horizontal).padding(.vertical, 20.0).background(tryAgainOrCorrect).opacity(0.8)
            }.onAppear(perform: loadData)

            TextField("Write answer here", text: $answerFromUser,onCommit:{
                submitAnswerAndGetNewQuestion()
            }).padding().border(Color.gray, width: 2).cornerRadius(3.0).padding()
            Button(action: submitAnswerAndGetNewQuestion) {
                Text("Submit Answer").padding()
            }
            Button(action: loadData) {
                Text("Get New question").padding()
            }
            Button(action: resetScore){
                Text("Reset Score").padding()
            }
            
            Spacer()
        }
    }
}
struct Result: Codable {
    var questionId: Int
    var question: String
    var answer: String
}


struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
