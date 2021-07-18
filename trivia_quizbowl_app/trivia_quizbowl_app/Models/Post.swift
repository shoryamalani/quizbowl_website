//
//  Post.swift
//  trivia_quizbowl_app
//
//  Created by Shorya Malani on 7/17/21.
//

import Foundation

struct Question: Codable {
    var questionId: Int
    var question: [String]
    var answer: String
}
