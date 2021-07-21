 //
//  ContentView.swift
//  trivia_quizbowl_app
//
//  Created by Shorya Malani on 7/17/21.
//

import SwiftUI
import SwiftUIX
import CoreData

struct ContentView: View {
    @State private var answerFromUser: String = ""
    @State private var points: Int = 0
    @State private var colorScheme:[Color] = [Color(#colorLiteral(red: 1, green: 0.4002141953, blue: 0.372333765, alpha: 1)),Color(#colorLiteral(red: 0.7784249187, green: 0.9098988175, blue: 0.6665911674, alpha: 1))] // The first one is the background color while the second one is the button color
    //I don't think we need the variable correctLastQuestion as of now, but I'm just keeping it in case we might need it later
    @State private var correctLastQuestion:String = ""
    @State private var correctThisQuestion:String = ""
    @State private var totalQuestionsCorrect: Int = 0
    @State private var totalNegatives: Int = 0
    @State private var tryAgainOrCorrect:Color = Color.white
    @State private var difficulty: Double = 1
    @State private var questionShown:String = ""
    @State private var answer:String = ""
    @State private var wordsShown:Int = 0
    @State private var buzzTime:Int = 0
    @State private var buzzed:Bool = false
    @State private var buzzOrSubmit:String = "Buzz"
    @State private var showAnswerBox: Bool = false
    @State private var canSubmitQuestion: Bool = false
    @State private var networkInfoForUser: String = ""
    @State private var questionId: Int = 0
    @State private var questionIdFromTimer: Int = 0
    @State private var gameTimer = Timer.publish(every: 0.5, on: .main, in: .common).autoconnect()
    @State private var showInRoundMode:Bool = false
    //the variable below is simply to show them the correct spelling of the answer only if they buzzed correctly
    @State private var showCorrectAnswer:Bool = false
    @State private var correctAnswer:String = ""
    @State private var correctAnswerTime:Int = 0
    @State private var roundQuestions:[Question]!
    @State private var questionNumber:Int = 0
    @State private var thisQuestion:Question!
    @State private var fullQuestion:[String] = [""]
    @State private var correctOrNot:String = ""
    @State private var textFieldId: String = UUID().uuidString
    @Environment(\.managedObjectContext) private var viewContext

//   @FetchRequest(
//        sortDescriptors: [NSSortDescriptor(keyPath: \Item.timestamp, ascending: true)],
//        animation: .default)
//    private var items: FetchedResults<Item>
    func submitAnswerAndGetNewQuestion() {
        textFieldId = UUID().uuidString
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
                correctOrNot = "Correct"
                tryAgainOrCorrect = Color.green
                showCorrectAnswer = true
                correctAnswerTime = 18
                correctAnswer = test.correctAnswer
                showAnswerBox = false
                totalQuestionsCorrect += 1
                points+=10
                buzzed = false
                showAnswerBox = false
                canSubmitQuestion = false
                buzzOrSubmit = "Buzz" // resets the text to buzz
                nextQuestion()
                canSubmitQuestion = false
            }else{
                canSubmitQuestion = false
                correctOrNot = "Incorrect"
                showAnswerBox = false
                tryAgainOrCorrect = Color.red
                totalNegatives += 1
                correctAnswerTime = 18
                correctAnswer = test.correctAnswer
                showAnswerBox = false
                points -= 5
                buzzed = false
                buzzOrSubmit = "Buzz" // resets the text to buzz
                nextQuestion()
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
        tryAgainOrCorrect = Color.white
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
        if (correctAnswerTime>0){
            correctAnswerTime -= 1
        }
        if (correctAnswerTime == 0){
            tryAgainOrCorrect = Color.white
        }
    }
    func stopRound(){
        showInRoundMode = false
        questionNumber = 0
    }
    func nextQuestion(){
        textFieldId = UUID().uuidString
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
        
        if Int(difficulty) != 10 {
            webservice().getRoundQuestionsWithDifficulty(difficulty:Int(difficulty)){responseQuestions in
                roundQuestions = responseQuestions
                nextQuestion()
            }
        }else {
            webservice().getRoundQuestions{
                roundQuestions = $0
                print(roundQuestions as Any)
                nextQuestion()
            }
        }
        
        
        showInRoundMode = true
    }
//    func loadData() {
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
        
//    }
    var body: some View {
        NavigationView{
            ZStack(){
                RadialGradient(gradient: Gradient(colors: [Color(#colorLiteral(red: 0.4745098054, green: 0.8392156959, blue: 0.9764705896, alpha: 1)), tryAgainOrCorrect]), center: .center, startRadius: /*@START_MENU_TOKEN@*/5/*@END_MENU_TOKEN@*/, endRadius: /*@START_MENU_TOKEN@*/500/*@END_MENU_TOKEN@*/).edgesIgnoringSafeArea(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
                VStack() {
                    
                    Text("Points: \(String(points))").font(.headline).padding(.vertical, 10.0).padding(.horizontal).cornerRadius(5)
                    Text("\(totalQuestionsCorrect) correct | \(totalNegatives) incorrect").padding().cornerRadius(5).onReceive(gameTimer, perform: { timer in
                        addWordAndCheckNeed()
                    }) // This is where it shows if the question is right NEEDS CHANGING
                    Divider()
                    
                    VStack() {
                        //shows the correct answer with spelling and everything
                        if(correctAnswerTime>0){
                            Text("\(correctOrNot) the exact answer was \(correctAnswer).\(networkInfoForUser)").padding().background(tryAgainOrCorrect)
                        }
                        
                        Text(String(questionShown)) // This is where the question is shown
                            .font(.headline)
                            .foregroundColor(Color.black)
                            .padding()
                            .minimumScaleFactor(0.6)
                        if(showInRoundMode){
                            Divider()
                        }
    //                    Text("This Question: \(correctThisQuestion)").font(.headline).padding(.horizontal).padding(.vertical, 20.0).background(tryAgainOrCorrect).opacity(0.8)
                    }
                    // So this is the text box underneath and the reason it has the opacity show box answer is to hide it when it shouldnt be shown
                    // On the other hand onCommit is when you hit enter
                    if(showAnswerBox){
                        CocoaTextField("Write answer here...", text: $answerFromUser,onCommit:{
                            submitAnswerAndGetNewQuestion()
                        }).isFirstResponder(true)
                        .id(textFieldId)
                        .padding()
                        .border(Color.gray, width: 2)
                        .cornerRadius(3.0).opacity(showAnswerBox ? 1 : 0)
                        .foregroundColor(Color.black)
                        .background(Color.white)
                    }
                    VStack(){
                        
                        Button(action:{
                                let impactMed = UIImpactFeedbackGenerator(style: .medium)
                                impactMed.impactOccurred()
                                submitAnswerAndGetNewQuestion()
                            
                        }) {
                            Text(buzzOrSubmit).padding().background(colorScheme[1]).foregroundColor(Color(#colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)))
                        }
                        Button(action: nextQuestion) {
                            Text("New Question").padding().background(colorScheme[1]).foregroundColor(Color(#colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)))

                        } // gets a new question
                        
            //            // the buzzOrSubmit is just changing from Buzz to Submit answer based on what needs to be shown
                        
                     //   Button(action: skipToEnd){
                       //     Text("Skip To The End").padding()
                        // }
                    }.opacity(showInRoundMode ? 1 : 0) // This should be shown when in round
                    if showInRoundMode == false{
                        VStack(){
                            Button(action:startRound){
                                Text("Start Round").padding().background(colorScheme[1]).foregroundColor(Color(#colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)))

                            }
                            VStack {
                                Slider(value: $difficulty, in: 1...10,step:1)
                                if (difficulty != 10){
                                Text("Difficulty \(difficulty, specifier: "%.1f") Setting it to 10 will make it random difficulty.")
                                } else {
                                    Text("Random Difficulty")
                                }
                            }.padding()

                        }.padding()
                        Spacer()
                    }
        //            Button(action: resetScore){
        //                Text("Reset Score").padding().padding(.bottom)
        //            } // Resets Score NEEDS CHANGING
                    NavigationLink("More Options",
                                   destination: SettingsScreen()).padding(.bottom, 5.0).foregroundColor(.green)
                    NavigationLink("Information",
                                   destination: InformationScreen()).padding().foregroundColor(.orange)
                }
                .navigationTitle("Back")
                .navigationBarHidden(true)
            }
        }
    }
}
//For this settings screen, we need to implement stuff for categories and things like that
struct SettingsScreen: View {
    var body: some View{
        ZStack {
            RadialGradient(gradient: Gradient(colors: [Color(#colorLiteral(red: 0, green: 0.9764705896, blue: 0.5707718923, alpha: 1)), Color(#colorLiteral(red: 0.3299842497, green: 0.9764705896, blue: 0.001610396137, alpha: 1))]), center: .center, startRadius: /*@START_MENU_TOKEN@*/5/*@END_MENU_TOKEN@*/, endRadius: /*@START_MENU_TOKEN@*/500/*@END_MENU_TOKEN@*/).edgesIgnoringSafeArea(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
            VStack {
                Text("Category info and stuff like that")
            }
        }
    }
}
struct InformationScreen: View {
    var body: some View{
        ZStack{
            RadialGradient(gradient: Gradient(colors: [Color(#colorLiteral(red: 1, green: 0.9588134618, blue: 0, alpha: 1)), Color(#colorLiteral(red: 0.9764705896, green: 0.5343115986, blue: 0.1183268753, alpha: 1))]), center: .center, startRadius: /*@START_MENU_TOKEN@*/5/*@END_MENU_TOKEN@*/, endRadius: /*@START_MENU_TOKEN@*/500/*@END_MENU_TOKEN@*/).edgesIgnoringSafeArea(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
            VStack {
                Text("App Name is a trivia app coded and designed by Shorya Malani and Arnav Lahoti. App Name is a fun way to brush up on trivia or practice Quizbowl.").foregroundColor(Color(#colorLiteral(red: 0.9764705896, green: 0.002571355588, blue: 0.7499031048, alpha: 1)))
                Spacer()
                Text("To start playing, hit the Start Round button, and questions will appear. Each round consists of 10 questions of whichever difficulty you have selected.").foregroundColor(Color(#colorLiteral(red: 0.9764705896, green: 0.002571355588, blue: 0.7499031048, alpha: 1)))
                Spacer()
                Text("To answer a question, hit buzz when you think you know the answer and type the answer in. If you get it correct, you get 10 points, but each time you get it wrong you lose 5 points.").foregroundColor(Color(#colorLiteral(red: 0.9764705896, green: 0.002571355588, blue: 0.7499031048, alpha: 1)))
                Spacer()
                Text("All questions are taken with permission from QuizDB.org's question database, but we are not officially affiliated with them.").foregroundColor(Color(#colorLiteral(red: 0.9764705896, green: 0.002571355588, blue: 0.7499031048, alpha: 1)))
                Spacer()
                Text("To contact the developers, email shoryamal@gmail.com or lahoti500@gmail.com. All feedback and suggestions for the app are welcome.").foregroundColor(Color(#colorLiteral(red: 0.9764705896, green: 0.002571355588, blue: 0.7499031048, alpha: 1)))
            }
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
    

//private func addItem() {
    //withAnimation {
        //let newItem = Item(context: viewContext)
        //newItem.timestamp = Date()
//
      //  do {
         //   try viewContext.save()
       // } catch {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
        //    let nsError = error as NSError
      //      fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
    //    }
  //  }
//}

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
