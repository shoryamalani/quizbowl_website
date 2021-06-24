//
//  ContentView.swift
//  Shared
//
//  Created by Aryaman Lahoti on 6/19/21.
//

import SwiftUI

struct ContentView: View {
    @State private var results = [Result]()
    func loadData() {
        guard let url = URL(string: "https://quizbowl.shoryamalani.com/get_question") else {
            print("Invalid URL")
            return
        }
    }
    var body: some View {
        List(results, id: \.questionId) { item in
            VStack(alignment: .leading) {
                Text(item.question)
                    .font(.headline)
                Text(item.answer)
            }
        }.onAppear(perform: loadData)
    }
}
struct Response: Codable {
    var results: [Result]
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
