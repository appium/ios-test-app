//  CalculateScreen.swift
//  TestAppUITests
//
//  Created by Khamaru, Suparna on 01/09/19.

import XCTest

class CalculateScreen: LandingScreenElements {
    
    func calculateSum(firstNumber: Int,
                      secondNumber: Int) {
        
        firstTextField.tap()
        firstTextField.typeText(String(firstNumber))
        secondTextField.tap()
        secondTextField.typeText(String(secondNumber))
        computeButton.tap()
    }
    
    func enter(number: Int,
               in field: XCUIElement) -> Self {
        field.tap()
        field.typeText(String(number))
        return self
    }
    
    func tapOn(button: XCUIElement) {
        button.tap()
    }
}
