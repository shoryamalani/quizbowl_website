//
//  GameView.swift
//  quizbowl_trivia_app
//
//  Created by Shorya Malani on 1/7/22.
//

import SwiftUI
import Alamofire

struct GameView: View {

    @Binding var gameQuestions:[Question]
    @State var gameText:String = ""
    var body: some View {
        
        return VStack(){
            Text(gameText)
        }.onAppear {
            
            self.startGameWithQuestions(questions: gameQuestions)
        }
    }
    func startGameWithQuestions(questions:[Question]){
        for question in questions{
            print(question.question)
        }
    }
    
}


//
struct GameView_Previews: PreviewProvider {
   
    @State static var questions:[Question] = [Question(questionId: 2, question: "Question:", answer: "answer")]
    
    
    static var previews: some View {
        GameView(gameQuestions: $questions)
    }
}
