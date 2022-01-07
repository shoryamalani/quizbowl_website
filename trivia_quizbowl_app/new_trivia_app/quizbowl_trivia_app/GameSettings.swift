//
//  GameSettings.swift
//  quizbowl_trivia_app
//
//  Created by Shorya Malani on 1/4/22.
//

import SwiftUI

struct GameSettings:View {
    @State var requireSpecificDifficultyQuestions = false
    @State var gameDifficulty = 1.0
    @State var showGameDifficulty = false
    @State private var categories = [
    Category(id: 14, name: "Mythology"),
    Category(id: 15, name: "Literature"),
    Category(id: 16, name: "Trash"),
    Category(id: 17, name: "Science"),
    Category(id: 18, name: "History"),
    Category(id: 19, name: "Religion"),
    Category(id: 20, name: "Geography"),
    Category(id: 21, name: "Fine Arts"),
    Category(id: 22, name: "Social Science"),
    Category(id: 25, name: "Philosphy"),
    Category(id: 26, name: "Current Events"),
    ]
//    let categories = [1,2,3,4]
    var body: some View{
       
        VStack(){
            Text("Game Settings")
            
            Toggle(isOn:$showGameDifficulty) {
                Text("Choose Difficulty")
            }.fixedSize()
            if(!showGameDifficulty){
                Text("Difficulty is random")
            }
            else {
                Text("Difficulty: \(Int(gameDifficulty * 8.0 + 1))")
                HStack(){
                    Text("0")
                    Slider(value: $gameDifficulty)
                    Text("9")
                }.padding()
            }
            Form{
            List($categories) { $cat in
                HStack(){
                    Text(cat.name)
                    Spacer()
                    Toggle("Choose this category",isOn: $cat.isSelected).labelsHidden()
                }
            }
            }
            Button(action:startGame){
                Text("Start Game")
            }
            
           
        }.padding()
    }
    func startGame() -> Void{

        for item in categories{
            if item.isSelected {
                print(item.name+": True")
            }
            else{
                print(item.name+": False")
            }
        }
        var final_dif = 0
        if showGameDifficulty{
            final_dif = Int(gameDifficulty * 8.0 + 1)
        }
        else{
            final_dif = 11
        }
        webservice().getRoundQuestionsWithDifficultyTopicsAndNumOfQuestions(difficulty: final_dif, categories: categories, numOfQuestions: 20, completion: {data in
            print(data)
        })
            return
    }

}


struct GameSettings_Previews: PreviewProvider {
    static var previews: some View {
        GameSettings()
    }
}
