 //
//  ContentView.swift
//  trivia_quizbowl_app
//
//  Created by Shorya Malani on 7/17/21.
//

import SwiftUI
import CoreData

struct ContentView: View {
    @State private var answerFromUser: String = ""
    @State private var points: Int = 0
    //I don't think we need the variable correctLastQuestion as of now, but I'm just keeping it in case we might need it later
    @State private var correctLastQuestion:String = ""
    @State private var correctThisQuestion:String = ""
    @State private var totalQuestionsCorrect: Int = 0
    @State private var totalNegatives: Int = 0
    @State private var tryAgainOrCorrect:Color = Color.white
    
    @State private var questionShown:String = ""
    @State private var answer:String = ""
    @State private var wordsShown:Int = 0
    @State private var buzzTime:Int = 0
    @State private var buzzed:Bool = false
    @State private var buzzOrSubmit:String = "Buzz"
    @State private var showAnswerBox: Bool = false
    @State private var canSubmitQuestion: Bool = false
    @State private var networkInfoForUser: String = ""
    @State private var opacityOfAnswerBox: Double = 0.0
    @State private var questionId: Int = 0
    @State private var questionIdFromTimer: Int = 0
    @State private var gameTimer = Timer.publish(every: 0.5, on: .main, in: .common).autoconnect()
    @State private var showInRoundMode:Bool = false
    //the variable below is simply to show them the correct spelling of the answer only if they buzzed correctly
    @State private var ifCorrectShowAnswer: String = ""
    @State private var roundQuestions:[Question]!
    @State private var questionNumber:Int = 0
    @State private var thisQuestion:Question!
    @State private var fullQuestion:[String] = [""]
    @Environment(\.managedObjectContext) private var viewContext

//   @FetchRequest(
//        sortDescriptors: [NSSortDescriptor(keyPath: \Item.timestamp, ascending: true)],
//        animation: .default)
//    private var items: FetchedResults<Item>
    func submitAnswerAndGetNewQuestion() {
        guard (canSubmitQuestion) else { // makes sure they have not already answered
            networkInfoForUser = " The network is being slow"
            return
        }
        guard(buzzed) else { // this changes the buzz to submit answer
            buzzOrSubmit = "Submit Answer"
            showAnswerBox = true
            buzzed = true
            buzzTime = 0
            return
        }
        guard (answerFromUser != "") else { // makes sure the answer isnt blank
            return
        }
        webservice().sendAnswerToQuestion(question:thisQuestion,answer: answerFromUser.lowercased()){test in
            print(test)
            if (test.correctOrNot){
                correctLastQuestion = "correct"
                correctThisQuestion = "correct"
                tryAgainOrCorrect = Color.green
                ifCorrectShowAnswer = "Correct!"
                opacityOfAnswerBox = 0.8
                totalQuestionsCorrect += 1
                points+=10
                buzzed = true
                showAnswerBox = false
                canSubmitQuestion = false
                buzzOrSubmit = "Buzz" // resets the text to buzz
                nextQuestion()
            }else{
                correctThisQuestion = "try again"
                showAnswerBox = false
                tryAgainOrCorrect = Color.red
                totalNegatives += 1
                points -= 5
                buzzed = false
                buzzOrSubmit = "Buzz" // resets the text to buzz
            }
            answerFromUser = ""
            buzzTime = 0 // reset buzz timer
        }
        
        
    }
    func resetScore() {
        points = 0
        totalNegatives = 0
        totalQuestionsCorrect = 0
        correctLastQuestion = ""
        correctThisQuestion = ""
        tryAgainOrCorrect = Color.blue
    }
    func skipToEnd() {
        questionShown = ""
        for word in fullQuestion {
            questionShown = questionShown + " " + word
        }
        wordsShown = fullQuestion.count
        
    }
    func addWordAndCheckNeed(){
        if showInRoundMode{
            print("here")
            if (questionNumber > 0){
                print(thisQuestion.answer)
            }
            
            if(!buzzed){
                if(!(wordsShown > (fullQuestion.count - 1))){
                    questionShown = questionShown + " " + fullQuestion[wordsShown]
                    wordsShown += 1
                    canSubmitQuestion = true
                }
            }else{
                if (buzzTime > 40){ // This is how much time you have as you have buzzed
                    points = points - 5 // if you buzz for longer than the 10 seconds you lose 5 points
                    buzzed = false
                }
                buzzTime+=1
            }
            if wordsShown == fullQuestion.count{
    //            nextQuestion()
                
                
            }
        }
    }
    func stopRound(){
        showInRoundMode = false
        questionNumber = 0
    }
    func nextQuestion(){
        
        wordsShown = 0
        questionShown = ""
        if (questionNumber > roundQuestions.count - 1){
            return stopRound()
        }
        thisQuestion = roundQuestions[questionNumber]
        fullQuestion = thisQuestion.question
//        gameTimer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true){timer in
//            addWordAndCheckNeed(question:thisQuestion)
//        }
//        gameTimer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
        questionNumber+=1
        
        
    }

    func startRound(){
        webservice().getRoundQuestions{
            roundQuestions = $0
            print(roundQuestions as Any)
            nextQuestion()
        }
        
        showInRoundMode = true
    }
    func loadData() {
//        webservice().getQuestion {
//            print($0)
//        }
//        if(gameTimer.isValid) {
//            gameTimer.invalidate()
//        }
//        buzzed = false
//        opacityOfAnswerBox = 0.0
//        guard let url = URL(string: "https://quizbowl.shoryamalani.com/get_question") else {
//            print("Invalid URL")
//            return
//        }
//           let request = URLRequest(url: url)
//        URLSession.shared.dataTask(with: request) { data, response, error in
//
//            if let data = data {
//                if let decodedResponse = try? JSONDecoder().decode(Result.self, from: data) {
//                    // we have good data – go back to the main thread
//                    print("here")
//                    DispatchQueue.main.async {
//                        // update our UI
//                        full_question = decodedResponse.question // this is the question in a list
//                        print(full_question)
//                        networkInfoForUser = ""
//                        question_shown = decodedResponse.question[0] // this is what people see on screen
//                        answer = decodedResponse.answer // this is the whole answer NEEDS CHANGING LATER
//                        questionId = decodedResponse.questionId
//                        wordsShown = 1
//                        buzzed = false
//
////                        gameTimer = Timer.scheduledTimer(timeInterval: 0.25,target:self,selector:addWordAndCheckNeed, userInfo: true, repeats: false)
//
//                    }
//
//
//                    // everything is good, so we can exit
//                    return
//                }
//            }
//
//            // if we're still here it means there was a problem
//            print("Fetch failed: \(error?.localizedDescription ?? "Unknown error")")
//        }.resume()
        
    }
    var body: some View {
        ZStack(){
            RadialGradient(gradient: Gradient(colors: [Color(#colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)), Color(#colorLiteral(red: 0.4392156899, green: 0.01176470611, blue: 0.1921568662, alpha: 1))]), center: .center, startRadius: /*@START_MENU_TOKEN@*/5/*@END_MENU_TOKEN@*/, endRadius: /*@START_MENU_TOKEN@*/500/*@END_MENU_TOKEN@*/).edgesIgnoringSafeArea(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
            VStack() {
                
                Text("Points: \(String(points))").font(.headline).padding(.vertical, 10.0).padding(.horizontal).background(Color.yellow)
                Text("Stats for this session: \(totalQuestionsCorrect) questions correct and \(totalNegatives) incorrect attempts").padding().background(Color.orange)
                
                
                VStack() {
                    //shows the correct answer with spelling and everything
                    Text("\(ifCorrectShowAnswer) The answer was \(answer).\(networkInfoForUser)").padding().background(tryAgainOrCorrect).opacity(opacityOfAnswerBox)
                    
                    Text(String(questionShown)) // This is where the question is shown
                        .font(.headline)
                        .foregroundColor(Color.white)
                        .padding()
                        .background(Color(#colorLiteral(red: 0.7254902124, green: 0.4784313738, blue: 0.09803921729, alpha: 1)))
                        .minimumScaleFactor(0.6)
                    Text("This Question: \(correctThisQuestion)").font(.headline).padding(.horizontal).padding(.vertical, 20.0).background(tryAgainOrCorrect).opacity(0.8).onReceive(gameTimer, perform: { timer in
                        addWordAndCheckNeed()
                    }) // This is where it shows if the question is right NEEDS CHANGING
                }
                // So this is the text box underneath and the reason it has the opacity show box answer is to hide it when it shouldnt be shown
                // On the other hand onCommit is when you hit enter
                TextField("Write answer here", text: $answerFromUser,onCommit:{
                    submitAnswerAndGetNewQuestion()
                }).padding().border(Color.gray, width: 2).cornerRadius(3.0).opacity(showAnswerBox ? 1 : 0).foregroundColor(Color(#colorLiteral(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)))
                VStack(){
                    Button(action: submitAnswerAndGetNewQuestion) {
                        Text(buzzOrSubmit).padding()
                    }
        //            // the buzzOrSubmit is just changing from Buzz to Submit answer based on what needs to be shown
                    Button(action: nextQuestion) {
                        Text("Get New Question").padding()
                    } // gets a new question
                 //   Button(action: skipToEnd){
                   //     Text("Skip To The End").padding()
                    // }
                }.opacity(showInRoundMode ? 1 : 0) // This should be shown when in round
                if showInRoundMode == false{
                    VStack(){
                        Button(action:startRound){
                            Text("Start Round").padding()
                        }
                    }
                }
    //            Button(action: resetScore){
    //                Text("Reset Score").padding().padding(.bottom)
    //            } // Resets Score NEEDS CHANGING
                
            }
            
        }
    }
        //        List {
//            ForEach(items) { item in
//                Text("Item at \(item.timestamp!, formatter: itemFormatter)")
//            }
//            .onDelete(perform: deleteItems)
//        }
//        .toolbar {
//            #if os(iOS)
//            EditButton()
//            #endif
//
//            Button(action: addItem) {
//                Label("Add Item", systemImage: "plus")
//            }
//        }
    

    private func addItem() {
        withAnimation {
            let newItem = Item(context: viewContext)
            newItem.timestamp = Date()

            do {
                try viewContext.save()
            } catch {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                let nsError = error as NSError
                fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
            }
        }
    }

//    private func deleteItems(offsets: IndexSet) {
//        withAnimation {
//            offsets.map { items[$0] }.forEach(viewContext.delete)
//
//            do {
//                try viewContext.save()
//            } catch {
//                // Replace this implementation with code to handle the error appropriately.
//                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
//                let nsError = error as NSError
//                fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
//            }
//        }
//    }
}

private let itemFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateStyle = .short
    formatter.timeStyle = .medium
    return formatter
}()

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView().environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
    }
}
