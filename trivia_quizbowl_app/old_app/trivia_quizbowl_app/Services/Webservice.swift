//
//  Webservice.swift
//  trivia_quizbowl_app
//
//  Created by Shorya Malani on 7/17/21.
//

import Foundation
import Alamofire
var baseUrlG:String = "https://quizbowl.shoryamalani.com/"
class webservice {
//    func getQuestion(completion: @escaping (Question) -> ()){
//        guard let url = URL(string:
//                "https://quizbowl.shoryamalani.com/get_question")
//        else {
//            fatalError("cant get data")
//        }
////        getQuestion(url,Question)
////        let data = getRequest(url: url)[0]
//        URLSession.shared.dataTask(with: url) { data, response, error in
//            let out_data = try!
//                JSONDecoder().decode(Question.self, from:data!)
//            DispatchQueue.main.async{
//                completion(out_data)
//            }
//        }.resume()
//
//
//    }
//    func getRoundQuestions(completion: @escaping ([Question]) -> ()){
//        guard let url = URL(string:
//                "https://quizbowl.shoryamalani.com/get_round_questions")
//        else {
//            fatalError("cant get data")
//        }
////        getQuestion(url,Question)
////        let data = getRequest(url: url)[0]
//        URLSession.shared.dataTask(with: url) { data, response, error in
//            let out_data = try!
//                JSONDecoder().decode([Question].self, from:data!)
//            DispatchQueue.main.async{
//                completion(out_data)
//            }
//        }.resume()
//
//
//    }
    func sendAnswerToQuestion(question:Question,answer:String,completion: @escaping (ServerQuestionResponse)-> ()){
        guard let url =  URL(string:"https://quizbowl.shoryamalani.com/check_answer")
                else{
                    return
                }
                
                //### This is a little bit simplified. You may need to escape `username` and `password` when they can contain some special characters...
//        let body = "questionId=\(question.questionId)&answer=\(answer)&serverAnswer=\(question.answer)"
//                let finalBody = body.data(using: .utf8)
                var request = URLRequest(url: url)
                request.httpMethod = "POST"
                
                print(request)
                let body: [String: String] = ["questionId": String(question.questionId), "answer": answer,"serverAnswer":question.answer]

                let finalBody = try! JSONSerialization.data(withJSONObject: body)
                request.httpBody = finalBody
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                URLSession.shared.dataTask(with: request){
                    (data, response, error) in
                    guard let data = data else { return }
                    let resData = try!
                        JSONDecoder().decode(ServerQuestionResponse.self, from: data)
                    print(resData.correctOrNot)
                    print(response as Any)
                    if let error = error {
                        print(error)
                        return
                    }
                    print(data, String(data: data, encoding: .utf8) ?? "*unknown encoding*")
                    completion(resData)
                    
                }.resume()
    }
//    func getRoundQuestionsWithDifficulty(difficulty:Int,completion: @escaping ([Question])-> ()){
//        guard let url =  URL(string:"https://quizbowl.shoryamalani.com/get_round_questions_with_difficulty")
//                else{
//                    return
//                }
//
//                //### This is a little bit simplified. You may need to escape `username` and `password` when they can contain some special characters...
////        let body = "questionId=\(question.questionId)&answer=\(answer)&serverAnswer=\(question.answer)"
////                let finalBody = body.data(using: .utf8)
//                var request = URLRequest(url: url)
//                request.httpMethod = "POST"
//
//                print(request)
//                let body: [String: String] = ["difficulty": String(difficulty)]
//
//                let finalBody = try! JSONSerialization.data(withJSONObject: body)
//                request.httpBody = finalBody
//                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
//                URLSession.shared.dataTask(with: request){
//                    (data, response, error) in
//                    guard let data = data else { return }
//                    let resData = try!
//                        JSONDecoder().decode([Question].self, from: data)
////                    print(resData.correctOrNot)
//                    print(response as Any)
//                    if let error = error {
//                        print(error)
//                        return
//                    }
//                    print(data, String(data: data, encoding: .utf8) ?? "*unknown encoding*")
//                    completion(resData)
//
//                }.resume()
//    }
    func getRoundQuestionsWithDifficultyTopicsAndNumOfQuestions(difficulty:Int,categories:[Category],numOfQuestions:Int, completion: @escaping ([Question])->()){
        
        var topics:[String:Bool] = [:]
        for cat in categories {
            topics[String(cat.id)] = cat.isSelected
        }
        let headers:HTTPHeaders = [.accept("application/json")]
        let body: [String:Any] = ["data":["difficulty": difficulty, "topics": topics, "numOfQuestions": 20]]
        AF.request("https://quizbowl.shoryamalani.com/get_questions_with_diff_topic_and_ques",method:.post,parameters: body,encoding: JSONEncoding.default,headers:headers).responseDecodable(of:[Question].self){response in
            if let data:[Question] = response.value {
                completion(data)
            }
            else{
                return
            }
        }.resume()
        
//        print(body)
//        do {
//            let finalBody = try JSONEncoder().encode(body)
//            print(finalBody)
//            request.httpBody = finalBody
//            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
//            URLSession.shared.dataTask(with: request){
//                (data, response, error) in
//                guard let data = data else { return }
//                let resData = try!
//                    JSONDecoder().decode([Question].self, from: data)
//                print(response as Any)
//                if let error = error {
//                    print(error)
//                    return
//                }
//                print(data, String(data: data, encoding: .utf8) ?? "*unknown encoding*")
//                completion(resData)
//
//            }.resume()
//        } catch {
//            print("Error: ", error)
//            return
//        }
        
        
        
    }
    
}


//func getRequest(url:URL,data_type:AnyClass) -> Array<Any>{
//    let all_info: Array<Any> = URLSession.shared.dataTask(with: url) { data, response, error in
//        return [data,response,error]
//
//    }.resume()
//    return all_info
//}
