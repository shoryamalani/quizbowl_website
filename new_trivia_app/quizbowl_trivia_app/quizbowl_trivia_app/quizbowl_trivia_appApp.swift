//
//  quizbowl_trivia_appApp.swift
//  quizbowl_trivia_app
//
//  Created by Shorya Malani on 12/30/21.
//

import SwiftUI

@main
struct quizbowl_trivia_appApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
