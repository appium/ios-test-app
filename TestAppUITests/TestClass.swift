//  TestClass.swift
//  TestAppUITests
//
//  Created by Khamaru, Suparna on 31/08/19.

import XCTest

class TestClass: BaseClass {
    
    override func setUp() {
        super.setUp()
        app.launch()
    }
    
    func testCalculateSum() {
        let e = CalculateScreen(app)
        let two = TestData.two
        let five = TestData.five
        let seven = TestData.seven
        
        CalculateScreen(app)
            .enter(number: two, in: e.firstTextField)
            .enter(number: five, in: e.secondTextField)
            .tapOn(button: e.computeButton)
        
        XCTAssertEqual(seven, e.actual)
    }
}
