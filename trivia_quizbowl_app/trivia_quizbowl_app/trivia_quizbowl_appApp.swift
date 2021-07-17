//
//  trivia_quizbowl_appApp.swift
//  trivia_quizbowl_app
//
//  Created by Shorya Malani on 7/17/21.
//

import SwiftUI

@main
struct trivia_quizbowl_appApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
