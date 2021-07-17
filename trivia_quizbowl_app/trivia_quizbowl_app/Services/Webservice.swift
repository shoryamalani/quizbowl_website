//
//  Webservice.swift
//  trivia_quizbowl_app
//
//  Created by Shorya Malani on 7/17/21.
//

import Foundation
class webservice {
    func getQuestion(completion: @escaping (Question) -> ()){
        guard let url = URL(string:
                "https://quizbowl.shoryamalani.com/get_question")
        else {
            fatalError("cant get data")
        }
//        getQuestion(url,Question)
//        let data = getRequest(url: url)[0]
        URLSession.shared.dataTask(with: url) { data, response, error in
            let out_data = try!
                JSONDecoder().decode(Question.self, from:data!)
            DispatchQueue.main.async{
                completion(out_data)
            }
        }.resume()
        
        
    }
    func getRoundQuestions(completion: @escaping (Question) -> ()){
        guard let url = URL(string:
                "https://quizbowl.shoryamalani.com/get_round_question")
        else {
            fatalError("cant get data")
        }
//        getQuestion(url,Question)
//        let data = getRequest(url: url)[0]
        URLSession.shared.dataTask(with: url) { data, response, error in
            let out_data = try!
                JSONDecoder().decode(Question.self, from:data!)
            DispatchQueue.main.async{
                completion(out_data)
            }
        }.resume()
        
        
    }
}


//func getRequest(url:URL,data_type:AnyClass) -> Array<Any>{
//    let all_info: Array<Any> = URLSession.shared.dataTask(with: url) { data, response, error in
//        return [data,response,error]
//
//    }.resume()
//    return all_info
//}
