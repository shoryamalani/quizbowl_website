//
//  ContentView.swift
//  Shared
//
//  Created by Aryaman Lahoti on 6/19/21.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello, world!")
                .padding()
            Button(action: /*@START_MENU_TOKEN@*//*@PLACEHOLDER=Action@*/{}/*@END_MENU_TOKEN@*/) {
                Text("This is a test").padding()
            }.padding()
            List {
                Text("This is a list")
                Text("This is a list 1")
                Text("This is a list 2")
            }

        }
        
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
