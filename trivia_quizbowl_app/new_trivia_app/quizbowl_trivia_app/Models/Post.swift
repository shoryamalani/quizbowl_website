//
//  Post.swift
//  trivia_quizbowl_app
//
//  Created by Shorya Malani on 7/17/21.
//

import Foundation

struct Question: Codable {
    var questionId: Int
    var question: String
    var answer: String
}

struct sendQuestionRequestWithInfo: Codable {
    var difficulty:Int
    var topics:[String:Bool]
    var numOfQuestions:Int
}

struct ServerQuestionResponse:Codable{
    var correctOrNot:Bool
    var correctAnswer:String
}

