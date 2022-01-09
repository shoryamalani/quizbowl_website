//
//  CurrentGameQuestions.swift
//  quizbowl_trivia_app
//
//  Created by Shorya Malani on 1/9/22.
//

import Foundation
import Combine

final class CurrentGameQuestions:ObservableObject {
//    var id = UUID()
    @Published var questions:[Question] = []
}

