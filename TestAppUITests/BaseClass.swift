//
//  BaseClass.swift
//  TestAppUITests
//
//  Created by Khamaru, Suparna on 31/08/19.
//

import XCTest

class BaseClass: XCTestCase {
    var app: XCUIApplication!
    
    override func setUp() {
        continueAfterFailure = false
        app = XCUIApplication()
    }
    
    override func tearDown() {
        app.terminate()
    }
}
