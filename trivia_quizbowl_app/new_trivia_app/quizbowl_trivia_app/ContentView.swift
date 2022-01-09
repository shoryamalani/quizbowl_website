//
//  ContentView.swift
//  quizbowl_trivia_app
//
//  Created by Shorya Malani on 12/30/21.
//

import SwiftUI
import CoreData


struct EditorConfig {
    var isEditorPresented = false
    
    mutating func present() {
        isEditorPresented = true
    }
    
    mutating func dismiss() {
        isEditorPresented = false
    }
}




struct ContentView: View {
    @State var showHomeSceen = true
    @Environment(\.managedObjectContext) private var viewContext
    @State var showGameOptions = false
    @State var showGameScreen = false
    @State var editorConfig = EditorConfig()
    @State var showGameView = false
    @ObservedObject var currentGameQuestions:CurrentGameQuestions = CurrentGameQuestions()
//    @Binding var questions:[Question]
    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \Item.timestamp, ascending: true)],
        animation: .default)
    private var items: FetchedResults<Item>
    func startGame() -> Void {
        editorConfig.present()
        return
    }
    var body: some View {
        if showHomeSceen {
        
            NavigationView{
                VStack(){
                    Spacer()
                    Text("Bowl Run")
                    Button(action: startGame){
                        Text("Start Game")
                    }.padding()
                        .sheet(isPresented: $editorConfig.isEditorPresented,onDismiss: {
                            showGameScreen = true
                            showHomeSceen = false
                            print(self.$currentGameQuestions.questions)
                            
                            return
                        }) {
                            GameSettings(editorConfig: $editorConfig,currentGameQuestions: self.$currentGameQuestions.questions)
                        }
                    
                    Spacer()
                    HStack(){
                        NavigationLink(destination:SettingsScreen()){
                        Image(systemName: "gearshape.fill")
                        }.foregroundColor(Color.white)
                        NavigationLink(destination:ProfilePage()){
                        Image(systemName: "person.crop.circle.fill")
                        }.foregroundColor(Color.white)
                    }.padding().background(Color.black).cornerRadius(10)

                }
            
            }
        } else {
            
            GameView(gameQuestions: self.$currentGameQuestions.questions)
        }
    }
    
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

    private func deleteItems(offsets: IndexSet) {
        withAnimation {
            offsets.map { items[$0] }.forEach(viewContext.delete)

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
}
struct SettingsScreen:View {
    func makeSettings() -> Void{
        print("Pray tell why you arent working")
        return
    }
    var body: some View{
        ZStack(){
            RadialGradient(gradient: Gradient(colors: [Color(#colorLiteral(red: 0.9254902005, green: 0.5573822824, blue: 0, alpha: 1)), Color(#colorLiteral(red: 0.9764705896, green: 0.3681272144, blue: 0, alpha: 1))]), center: .center, startRadius: /*@START_MENU_TOKEN@*/5/*@END_MENU_TOKEN@*/, endRadius: /*@START_MENU_TOKEN@*/500/*@END_MENU_TOKEN@*/).edgesIgnoringSafeArea(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
            VStack(){
                Text("Settings")
//                padding()
                Button(action:makeSettings){
                    Text("Connect a device JK LOL U CANT - L").padding().foregroundColor(Color.white)
                }
                Button(action:makeSettings){
                    Text("Choose a voice from the drop-down menu, which also doesn't exist xD").padding().foregroundColor(Color.white)
                }
            }
        }
    }

}
struct ProfilePage:View {
    var body: some View{
        Text("Profile screen")
    }

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
// used to be in content view
//        NavigationView {
//            List {
//                ForEach(items) { item in
//                    NavigationLink {
//                        Text("New Item at \(item.timestamp!, formatter: itemFormatter)")
//                    } label: {
//                        Text(item.timestamp!, formatter: itemFormatter)
//                    }
//                }
//                .onDelete(perform: deleteItems)
//            }
//            .toolbar {
//                ToolbarItem(placement: .navigationBarTrailing) {
//                    EditButton()
//                }
//                ToolbarItem {
//                    Button(action: addItem) {
//                        Label("Add Item", systemImage: "plus")
//                    }
//                }
//            }
//            Text("Select an item")
//        }
