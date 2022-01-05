//
//  Post.swift
//  trivia_quizbowl_app
//
//  Created by Shorya Malani on 1/5/22.
//

import Foundation

struct Question: Codable {
    var questionId: Int
    var question: [String]
    var answer: String
}
struct ServerQuestionResponse:Codable{
    var correctOrNot:Bool
    var correctAnswer:String
}
