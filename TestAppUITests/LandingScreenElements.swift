//
//  LandingScreenElements.swift
//  TestAppUITests
//
//  Created by Khamaru, Suparna on 05/09/19.
//

import Foundation
import XCTest

class LandingScreenElements {
    var app: XCUIApplication
    
    required init(_ app: XCUIApplication) {
        self.app = app
    }
    
    lazy var firstTextField = app
        .textFields[UniqueId.firstTextField]
        .firstMatch
    
    lazy var secondTextField = app
        .textFields[UniqueId.secondTextField]
        .firstMatch
    
    lazy var computeButton = app
        .buttons[UniqueId.computeButton]
        .firstMatch
    
    lazy var actual = Int(app
        .staticTexts[UniqueId.answerLabel]
        .firstMatch
        .label)
    
    func on<T: LandingScreenElements>(page: T.Type) -> T {
        return page.init(app)
    }
}
