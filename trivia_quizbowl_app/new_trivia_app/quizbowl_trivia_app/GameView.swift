//
//  GameView.swift
//  quizbowl_trivia_app
//
//  Created by Shorya Malani on 1/7/22.
//

import SwiftUI
import Alamofire
import AVFoundation
struct GameView: View {
    @StateObject var synthVM = SynthViewModel()
    @Binding var gameQuestions:[Question]
    @State var answerShown:String = ""
    var body: some View {
        
        return VStack(){
            GameQuestion(questionText:$synthVM.textSaid,answer:$answerShown)
            Button(action: {}, label: {
                VStack(){
                    Text("DIS IS DA ANSWER")
                    Text("DIS IS DA ANSWER")
                    Text("DIS IS DA ANSWER")
                    Text("DIS IS DA ANSWER")
                    Text("DIS IS DA ANSWER")
                    Text("DIS IS DA ANSWER")
                    Text("DIS IS DA ANSWER")
                    Text("DIS IS DA ANSWER")
                    Text("DIS IS DA ANSWER")
                    Text("DIS IS DA ANSWER")
                }
            })
        }.onAppear {
            
            self.startGameWithQuestions(questions: gameQuestions)
        }
    }
    func startGameWithQuestions(questions:[Question]){
        startQuestion(question: questions[0])
        //        for question in questions{
//            print(question.question + "-" + question.answer)
//            startQuestion(question:question)
//        }
    }
    func startQuestion(question:Question){
        
//        let str_split = question.question.components(separatedBy: " ")
        self.synthVM.speak(text:question.question)
    }
    
}


//
struct GameView_Previews: PreviewProvider {
   
    @State static var questions:[Question] = [Question(questionId: 2, question: "Question:", answer: "answer")]
    
    
    static var previews: some View {
        GameView(gameQuestions: $questions)
    }
}


class SynthViewModel:NSObject,ObservableObject  {
    private var speechSynthesizer = AVSpeechSynthesizer()
    @Published var textSaid = ""
    override init() {
        super.init()
        self.speechSynthesizer.delegate = self
        self.speechSynthesizer.stopSpeaking(at: .word)
    }

    func speak(text: String) {
        let utterance = AVSpeechUtterance(string: text)
    
        speechSynthesizer.speak(utterance)
        
    }
    }

    extension SynthViewModel: AVSpeechSynthesizerDelegate {
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didStart utterance: AVSpeechUtterance) {
        print("started")
    }
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didPause utterance: AVSpeechUtterance) {
        print("paused")
    }
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didContinue utterance: AVSpeechUtterance) {}
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {}
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, willSpeakRangeOfSpeechString characterRange: NSRange, utterance: AVSpeechUtterance) {
        guard let rangeInString = Range(characterRange, in: utterance.speechString) else { return }
        print("Will speak: \(utterance.speechString[rangeInString])")
        textSaid += " \(utterance.speechString[rangeInString])"
    }
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        print("finished")
    }
}
