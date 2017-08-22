Feature: Automation Challeng B API
	
	Scenario: API Automation Challenge B
		When Select "Restaurants" in API and make report
		And Append "Pizza" to "Restaurants" and search Restaurants Pizza in API and make report
        And Append "Pizza" to "Restaurants" and search Restaurants Pizza with filtered by Price "1" in API and make report
        And Append "Pizza" to "Restaurants" and search Restaurants Pizza with filtered by Price "1" and Category "sandwiches" in API and make report
		Then Report the star rating of "Restaurants pizza" with filtered by Price "1" and Category "sandwiches" in API and make reportin API
		Then Select the "first" result from the latest search results in API and Log all critical information and first 3 customer reviews