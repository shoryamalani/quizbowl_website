//
//  ContentView.swift
//  Shared
//
//  Created by Aryaman Lahoti on 6/19/21.
//

import SwiftUI

struct ContentView: View {
    @State private var results = ["","",""]
    @State private var answerFromUser: String = ""
    @State private var correct:String = ""
    func submitAnswerAndGetNewQuestion(){
        if (answerFromUser.lowercased() == results[2].lowercased()){
            correct = "correct"
            loadData()
        }else{
            correct = "try again"
            
            
        }
        answerFromUser = ""
        
        
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
            VStack() {
                Text(String(results[1]))
                    .font(.headline)
                Text("Answer: " + String(correct))
                    .font(.headline)
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
