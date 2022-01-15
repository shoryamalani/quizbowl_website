//
//  GameQuestion.swift
//  quizbowl_trivia_app
//
//  Created by Shorya Malani on 1/15/22.
//

import SwiftUI

struct GameQuestion: View {
    @Binding var questionText:String
    @Binding var answer:String
    @Environment(\.colorScheme) var colorScheme
    var body: some View {
        VStack(){
            ScrollView{
                Text(questionText).padding().colorInvert()
            }
            Divider()
            HStack(){
                Text("9 - Science").colorInvert().frame(maxWidth:.infinity, alignment: .leading).padding()
                Text(answer).colorInvert().frame(maxWidth:.infinity, alignment: .trailing).padding()
            }
        }.background(colorScheme == .dark ? Color.white : Color.black).cornerRadius(10).padding()
    }
}

//struct GameQuestion_Previews: PreviewProvider {
//    @State var quesText = "Heres a question that might have some small length but i want to see how it will look like this"
//    @State var quesType = "Science"
//    @State var quesDiff = 7
//    static var previews: some View {
//        GameQuestion(questionText: $quesText, questionDifficulty: $quesDiff, questionType: $quesType)
//    }
//}
